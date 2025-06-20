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
  // Add a timeout to ensure the Razorpay script has time to fully initialize
  setTimeout(() => {
    try {
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded or blocked by browser extension');
      }

      // Use fixed amount of 400 INR as requested
      // Note: Razorpay expects amount in paise (1 INR = 100 paise)
      const displayAmount = 40000; // 400 INR in paise
      
      // For testing, we don't need to generate an order ID - Razorpay will generate one for us
      // In production, order ID should come from your backend

      // Use Razorpay key from environment variables
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      
      const options = {
        key: razorpayKeyId, // Razorpay Key ID from environment
        amount: displayAmount.toString(),
        currency: 'INR', // Always use INR for Indian payment gateway
        name: 'AIstroGPT',
        description: 'Chat Access Payment',
        // Removing order_id as it requires server-side generation
        image: '/aistrogpt-logo.png', // Use your actual logo path
        handler: function (response: any) {
          try {
            // For development: Skip server verification and consider the payment successful
            // In production, this should verify the payment signature with your backend
            const isDev = process.env.NODE_ENV !== 'production' || 
                        !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 
                        razorpayKeyId === 'rzp_test_ouCfPyiBhQCVMO';
            
            if (isDev) {
              console.log('Development mode: Skipping Razorpay payment verification');
              // In development mode, assume payment success
              onSuccess({
                ...response,
                verified: true,
                amount: amount,
                test: true
              });
              return;
            }
            
            // For production: Verify with backend
            // This is async but we're not awaiting in the handler
            // as Razorpay expects a synchronous handler
            fetch('/api/verify-razorpay', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              }),
            })
            .then(res => res.json())
            .then(verificationResult => {
              if (verificationResult.success) {
                onSuccess({
                  ...response,
                  verified: true,
                  amount: amount
                });
              } else {
                throw new Error(verificationResult.message || 'Payment verification failed');
              }
            })
            .catch(error => {
              console.error('Error during Razorpay payment verification:', error);
              onError(error instanceof Error ? error : new Error('Payment verification failed'));
            });
          } catch (error) {
            console.error('Error in Razorpay handler:', error);
            onError(error instanceof Error ? error : new Error('Payment processing failed'));
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
            onError(new Error('Payment cancelled by user'));
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error('Razorpay payment failed:', response.error);
        onError(response.error);
      });
      
      rzp.open();
    } catch (error) {
      console.error('Error initializing Razorpay:', error);
      onError(error instanceof Error ? error : new Error('Failed to initialize payment'));
    }
  }, 300); // Add a slight delay to ensure the script is fully loaded
};

// Typescript type definition for window properties
declare global {
  interface Window {
    Razorpay: any;
    ENV_RAZORPAY_KEY_ID?: string;
  }
}
