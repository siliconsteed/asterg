// Razorpay Payment Verification API Route
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

    // Verify the payment signature
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ 
        error: 'Missing required Razorpay verification parameters' 
      }, { status: 400 });
    }

    // Create a signature with your key secret and order_id + payment_id
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    // Compare the signatures
    if (generatedSignature === razorpay_signature) {
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Payment verification failed: Invalid signature'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json({ 
      error: 'Failed to verify payment' 
    }, { status: 500 });
  }
}
