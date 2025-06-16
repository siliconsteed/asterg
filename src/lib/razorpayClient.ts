// Razorpay Client Integration
// This file contains functions to interact with Razorpay API

/**
 * Initialize Razorpay checkout with options
 * @param {number} amount - Payment amount (in USD)
 * @param {string} currency - Currency code (e.g., 'INR', 'USD')
 * @param {Function} onSuccess - Success callback function
 * @param {Function} onError - Error callback function
 * @param {Object} userDetails - Optional user details for prefill
 */
export const initializeRazorpayCheckout = (
  amount: number,
  currency: string = 'USD',
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  userDetails?: { email?: string; name?: string; phone?: string }
) => {
  if (!window.Razorpay) {
    console.error('Razorpay SDK not loaded');
    return;
  }

  // Convert USD to INR for Razorpay (which prefers INR)
  // This is a simplified conversion - in production, use real exchange rates or currency API
  const displayAmount = currency === 'USD' ? Math.round(amount * 100 * 75) : Math.round(amount * 100);
  
  // Generate an order ID (in production, this would come from your backend)
  const generatedOrderId = 'order_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_yourtestkey', // Enter the Key ID from Razorpay Dashboard
    amount: displayAmount.toString(),
    currency: currency === 'USD' ? 'INR' : currency, // Razorpay may require INR for Indian merchants
    name: 'AIstroGPT',
    description: 'Chat Access Payment',
    order_id: generatedOrderId, // This should ideally come from your server
    image: '/aistrogpt-logo.png', // Use your actual logo path
    handler: async function (response: any) {
      try {
        // Verify the payment with our server
        const verificationResponse = await fetch('/api/verify-razorpay', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          }),
        });
        
        const verificationResult = await verificationResponse.json();
        
        if (verificationResult.success) {
          // Payment verified successfully
          onSuccess({
            ...response,
            verified: true,
            amount: amount
          });
        } else {
          // Verification failed
          throw new Error(verificationResult.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Error during Razorpay payment verification:', error);
        onError(error instanceof Error ? error : new Error('Payment verification failed'));
      }
    },
    prefill: {
      name: userDetails?.name || '',
      email: userDetails?.email || '',
      contact: userDetails?.phone || ''
    },
    notes: {
      address: 'AIstroGPT Service'
    },
    theme: {
      color: '#4f46e5'
    },
    modal: {
      ondismiss: function() {
        console.log('Razorpay payment modal dismissed');
      }
    }
  };

  const rzp = new window.Razorpay(options);
  
  rzp.on('payment.failed', function (response: any) {
    console.error('Razorpay payment failed:', response.error);
    onError(response.error);
  });
  
  rzp.open();
};

// Typescript type definition for window.Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}
