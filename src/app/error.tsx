"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Something went wrong!</h2>
      <p>{error.message || 'An unexpected error occurred.'}</p>
      <button onClick={() => reset()} style={{ marginTop: 16, padding: '8px 24px', borderRadius: 8, background: '#eee', border: 'none', cursor: 'pointer' }}>
        Try again
      </button>
    </div>
  );
}
