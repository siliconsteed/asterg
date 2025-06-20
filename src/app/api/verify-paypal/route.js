// PayPal Payment Verification API Route
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { orderID } = await req.json();

    if (!orderID) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Get access token
    const accessTokenResponse = await fetch(
      `${process.env.PAYPAL_MODE === 'live' ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com'}/v1/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`
        },
        body: 'grant_type=client_credentials'
      }
    );

    const { access_token } = await accessTokenResponse.json();
    
    if (!access_token) {
      console.error('Failed to get PayPal access token');
      return NextResponse.json({ error: 'Failed to authenticate with PayPal' }, { status: 500 });
    }

    // Verify the order
    const orderResponse = await fetch(
      `${process.env.PAYPAL_MODE === 'live' ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com'}/v2/checkout/orders/${orderID}`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      }
    );

    const orderData = await orderResponse.json();

    if (orderData.status === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        orderData
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Payment not completed',
        orderData
      });
    }

  } catch (error) {
    console.error('Error verifying PayPal payment:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
