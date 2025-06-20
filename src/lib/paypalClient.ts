// PayPal Client Integration
// This file contains functions to interact with PayPal API

/**
 * Initialize PayPal button with options
 * @param {string} containerId - ID of the container where the PayPal button should be rendered
 * @param {number} amount - The payment amount
 * @param {Function} onSuccess - Success callback function
 * @param {Function} onError - Error callback function
 */
export const initializePayPalButton = (
  containerId: string, 
  amount: number, 
  onSuccess: (details: any) => void, 
  onError: (error: Error) => void
) => {
  if (!window.paypal) {
    console.error('PayPal SDK not loaded');
    return;
  }

  // Clear any existing buttons
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';

    // Render the PayPal button
    window.paypal.Buttons({
      // Style the button
      style: {
        color: 'blue',
        shape: 'rect',
        label: 'pay',
        height: 40
      },
      
      // Set up the transaction
      createOrder: function(data: any, actions: any) {
        return actions.order.create({
          purchase_units: [{
            description: 'AIstroGPT Chat Session',
            amount: {
              currency_code: 'USD',
              value: amount.toString()
            }
          }]
        });
      },
      
      // Finalize the transaction after approval
      onApprove: function(data: any, actions: any) {
        return actions.order.capture().then(async function(details: any) {
          try {
            // Verify the payment with our server
            const verificationResponse = await fetch('/api/verify-paypal', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderID: data.orderID
              }),
            });
            
            const verificationResult = await verificationResponse.json();
            
            if (verificationResult.success) {
              // Payment verified successfully
              onSuccess({
                ...details,
                verified: true,
                paymentId: details.id
              });
            } else {
              // Verification failed
              throw new Error(verificationResult.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Error during PayPal payment verification:', error);
            onError(error instanceof Error ? error : new Error('Payment verification failed'));
          }
        });
      },
      
      onError: function(err: Error) {
        console.error('PayPal Error:', err);
        onError(err);
      }
    }).render(`#${containerId}`);
  }
};

// Typescript type definition for window.paypal
declare global {
  interface Window {
    paypal?: any;
  }
}
