export default {
  PaymentTest: {
    module: 'Subscriptions',
    pageNumber: '62',
    title: 'Payment Method',
    init: ['.SignInCheck', '=.builtIn.payment.createSqPaymentForm'],
    save: [
      {
        '=.PaymentTest.CreatePayment.docAPI.store': '',
      },
    ],
    CreatePayment: {
      document: {
        '.Document': '',
        eid: '.Global.rootNotebookID',
        type: '.DocType.PayToSquare',
        subtype: {
          isEncrypted: '1',
          isOnServer: '0',
        },
        name: {
          title: '',
          nonce: '=.builtIn.payment.getPaymentNonce',
          type: '..CreatePayment.docAPI.store.subtype.mediaType',
          data: '',
        },
      },
      docAPI: {
        '.DocAPI': '',
        store: {
          api: 'cd',
          dataIn: 'CreatePayment.document',
          subtype: {
            mediaType: 'application/json',
          },
        },
      },
    },
    components: [
      {
        type: 'plugin',
        path: 'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js',
        contentType: 'library',
      },
      //   {
      //     type: 'plugin',
      //     path: 'https://js.squareupsandbox.com/v2/paymentform',
      //     contentType: 'library',
      //     mimeType: 'text/javascript',
      //   },
      {
        type: 'plugin',
        path: 'SquarePaymentForm.html',
      },
      {
        type: 'plugin',
        path: 'mysqpaymentform.css',
      },
      //   {
      //     type: 'plugin',
      //     path: 'SquarePaymentForm.js',
      //   },
      {
        type: 'view',
        style: {
          left: '0',
          top: '0',
          width: '1',
          height: '1',
        },
        children: [
          {
            '.BaseHeader3': null,
          },
          {
            '.HeaderLeftButton': null,
          },
          {
            '.HeaderRightImg': null,
            path: 'addMeeting.png',
            onClick: [
              {
                goto: 'AddPaymentMethod',
              },
            ],
          },
          {
            type: 'button',
            onClick: [
              {
                actionType: 'evalObject',
                object: [
                  { '=.builtIn.payment.getPaymentNonce': { dataIn: '' } },
                ],
              },
              {
                actionType: 'evalObject',
                object: '..save',
              },
              {
                actionType: 'evalObject',
                object: {
                  '.Global._nonce@': {
                    '=.builtIn.math.random': '',
                  },
                },
              },
              {
                goto: 'SubAndPaySuccessful',
              },
            ],
            text: 'Continue',
            style: {
              left: '0.1',
              top: '0.8',
              width: '0.8',
              height: '0.06',
              fontSize: '18',
              color: '0xffffffff',
              backgroundColor: '0x388eccff',
              textAlign: {
                x: 'center',
              },
              border: {
                style: '1',
              },
            },
          },
        ],
      },
    ],
  },
}
