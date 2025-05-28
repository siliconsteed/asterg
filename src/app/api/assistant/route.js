import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client with API key from environment variables
// Always use environment variables for API keys in production.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is missing! Set it in your .env.local file.');
}
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const assistantId = 'asst_thyd2tCfqb3cAw6TxUkUUmsC'; // Hardcoded for testing

export async function POST(req) {

  if (!assistantId) {
    console.error('ASSISTANT_API_ROUTE: OpenAI Assistant ID is not set in environment variables (OPENAI_ASSISTANT_ID) and no fallback is available.');
    return NextResponse.json({ error: 'OpenAI Assistant ID not configured on server.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { astrologyData, userQuery, threadId: existingThreadId } = body;

    if (!userQuery) {
      return NextResponse.json({ error: 'Missing userQuery in request body' }, { status: 400 });
    }

    let currentThreadId;
    let run;

    if (astrologyData && !existingThreadId) {
      // Case 1: First message - astrologyData is present, no existingThreadId
      const combinedMessage = `Astrological Context:\n${JSON.stringify(astrologyData, null, 2)}\n\nUser's Question: ${userQuery}`;
      console.log('ASSISTANT_API_ROUTE (New Thread): Creating thread with astrological context and user query...');

      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
      console.log('ASSISTANT_API_ROUTE (New Thread): Thread created:', currentThreadId);

      await openai.beta.threads.messages.create(currentThreadId, {
        role: 'user',
        content: combinedMessage,
      });
      console.log('ASSISTANT_API_ROUTE (New Thread): Initial message added to thread.');

      run = await openai.beta.threads.runs.create(currentThreadId, {
        assistant_id: assistantId,
      });
      console.log('ASSISTANT_API_ROUTE (New Thread): Run created:', run.id, 'Status:', run.status);

    } else if (existingThreadId && userQuery && !astrologyData) {
      // Case 2: Subsequent message - existingThreadId and userQuery are present, no astrologyData
      currentThreadId = existingThreadId;
      console.log(`ASSISTANT_API_ROUTE (Existing Thread ${currentThreadId}): Adding message: "${userQuery}"`);

      await openai.beta.threads.messages.create(currentThreadId, {
        role: 'user',
        content: userQuery,
      });
      console.log(`ASSISTANT_API_ROUTE (Existing Thread ${currentThreadId}): Message added.`);

      run = await openai.beta.threads.runs.create(currentThreadId, {
        assistant_id: assistantId,
      });
      console.log(`ASSISTANT_API_ROUTE (Existing Thread ${currentThreadId}): Run created:`, run.id, 'Status:', run.status);

    } else {
      console.error('ASSISTANT_API_ROUTE: Invalid combination of parameters.', body);
      return NextResponse.json({ error: 'Invalid request parameters. Provide (astrologyData and userQuery for a new thread) OR (threadId and userQuery for an existing thread).' }, { status: 400 });
    }

    // Wait for the run to complete (common logic)
    const checkStatusInterval = 1000; // ms
    const maxAttempts = 90; // ~90 seconds for completion
    let attempts = 0;

    while (['queued', 'in_progress', 'cancelling'].includes(run.status) && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, checkStatusInterval));
      run = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
      console.log(`ASSISTANT_API_ROUTE (Thread ${currentThreadId}): Run status (${attempts + 1}/${maxAttempts}): ${run.status}`);
      attempts++;
    }

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(currentThreadId, { order: 'asc' }); // Get messages, oldest first
      console.log(`ASSISTANT_API_ROUTE (Thread ${currentThreadId}): Messages retrieved for run ${run.id}.`);

      // Find the latest assistant message specifically from this run
      const assistantMessage = messages.data
        .filter(msg => msg.role === 'assistant' && msg.run_id === run.id)
        .pop(); // Since messages are ascending, pop gets the last (latest) one for this run

      if (assistantMessage && assistantMessage.content[0] && assistantMessage.content[0].type === 'text') {
        const assistantResponse = assistantMessage.content[0].text.value;
        console.log(`ASSISTANT_API_ROUTE (Thread ${currentThreadId}): Assistant response: "${assistantResponse.substring(0,100)}..."`);
        
        if (astrologyData && !existingThreadId) { // First call, return thread_id
          return NextResponse.json({ result: assistantResponse, thread_id: currentThreadId });
        } else { // Subsequent call
          return NextResponse.json({ result: assistantResponse });
        }
      } else {
        console.error(`ASSISTANT_API_ROUTE (Thread ${currentThreadId}): No text response found from assistant for run ${run.id}. Messages:`, messages.data.map(m => ({id: m.id, role: m.role, run_id: m.run_id, content_type: m.content[0]?.type }) ));
        return NextResponse.json({ error: 'No text response found from assistant or unexpected format for this run' }, { status: 500 });
      }
    } else {
      console.error(`ASSISTANT_API_ROUTE (Thread ${currentThreadId}): Run ended with status: ${run.status}`, run.last_error || run);
      const errorMessage = run.last_error ? run.last_error.message : 'Run did not complete successfully.';
      return NextResponse.json({ error: `Run failed: ${run.status}. Details: ${errorMessage}` }, { status: 500 });
    }

  } catch (error) {
    console.error('ASSISTANT_API_ROUTE: General Error:', error.name, error.message, error.stack);
    let errorMessage = 'Failed to get response from Assistant API';
    if (error.message) errorMessage += `: ${error.message}`;
    // Add more detailed OpenAI error information if available
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
        errorMessage += ` (OpenAI Details: ${error.response.data.error.message})`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
