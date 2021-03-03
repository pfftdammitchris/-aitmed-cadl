export default {
  createSqPaymentForm() {
    const sqNode___ = document.createElement('script')
    sqNode___.type = 'text/javascript'
    sqNode___.src = 'https://js.squareupsandbox.com/v2/paymentform'
    sqNode___.onload = () => {
      // onGetCardNonce is triggered when the "Pay $1.00" button is clicked
      // Create and initialize a payment form object
      //@ts-ignore
      window.paymentForm = new SqPaymentForm({
        // Initialize the payment form elements
        //TODO: Replace with your sandbox application ID
        applicationId: 'sandbox-sq0idb-NZW9Yiwvqiqf5zAaaoFQgA',
        inputClass: 'sq-input',
        autoBuild: false,
        // Customize the CSS for SqPaymentForm iframe elements
        inputStyles: [
          {
            fontSize: '16px',
            lineHeight: '24px',
            padding: '16px',
            placeholderColor: '#a0a0a0',
            backgroundColor: 'transparent',
          },
        ],
        // Initialize the credit card placeholders
        cardNumber: {
          elementId: 'sq-card-number',
          placeholder: 'Card Number',
        },
        cvv: {
          elementId: 'sq-cvv',
          placeholder: 'CVV',
        },
        expirationDate: {
          elementId: 'sq-expiration-date',
          placeholder: 'MM/YY',
        },
        postalCode: {
          elementId: 'sq-postal-code',
          placeholder: 'Postal',
        },
        // SqPaymentForm callback functions
        callbacks: {
          /*
           * callback function: cardNonceResponseReceived
           * Triggered when: SqPaymentForm completes a card nonce request
           */
          //@ts-ignore
          cardNonceResponseReceived: async function (errors, nonce, cardData) {
            if (errors) {
              // Log errors from nonce generation to the browser developer console.
              console.error('Encountered Square errors:')
              errors.forEach(function (error) {
                console.error('  ' + error.message)
              })
              alert(
                'Unable to process your payment at this time. Please try again later.'
              )
              return
            }
            const formContainer = document.getElementById('form-container')
            const nonceElement = document.createElement('div')
            nonceElement.setAttribute('type', 'hidden')
            nonceElement.setAttribute('id', 'card-nonce')
            formContainer?.appendChild(nonceElement)
            //@ts-ignore
            document.getElementById('card-nonce').value = nonce
            //@ts-ignore
            delete window.onGetCardNonce
            //@ts-ignore
            delete window.paymentForm
          },
        },
      })

      function onGetCardNonce(event) {
        console.log(event)
        // Don't submit the form until SqPaymentForm returns with a nonce
        event.preventDefault()
        // Request a nonce from the SqPaymentForm object
        //@ts-ignore
        paymentForm.requestCardNonce()
      }
      //@ts-ignore
      window.onGetCardNonce = onGetCardNonce

      //@ts-ignore
      paymentForm.build()
    }
    document.body.appendChild(sqNode___)
  },
  getPaymentNonce() {
    //@ts-ignore
    const nonce = document.getElementById('card-nonce').value
    return nonce
  },
}
