export default {
  AddDocuments: {
    pageNumber: '430 440',
    title: 'Documents',
    init: ['.SignInCheck'],
    save: [
      {
        '=.AddDocuments.newDoc.docAPI.store': '',
      },
      {
        '.Global._nonce@': {
          '=.builtIn.math.random': '',
        },
      },
    ],
    newDoc: {
      document: {
        '.Document': '',
        subtype: {
          isEncrypted: '1',
          isOnServer: '0',
        },
        type: '.DocType.UploadFile',
        name: {
          title: '',
          type: '..newDoc.docAPI.store.subtype.mediaType',
          data: 'binFile',
        },
        deat: {
          sig: '',
          url: '',
        },
        eid: '.Global.rootNotebookID',
      },
      docAPI: {
        '.DocAPI': '',
        store: {
          api: 'cd',
          dataKey: 'newDoc.document',
          subtype: {
            mediaType: '',
          },
        },
      },
    },
    components: [
      {
        '.BaseCheckView': '',
        message: 'Uploading in progress ...',
        viewTag: 'uploading',
      },
      {
        '.BaseHeader3': null,
      },
      {
        '.HeaderLeftButton': null,
      },
      {
        type: 'view',
        style: {
          left: '0',
          top: '0.1',
          width: '1',
          height: '0.85',
        },
        children: [
          {
            type: 'label',
            text: 'Document Name',
            style: {
              left: '0.133',
              top: '0.08',
              width: '0.72',
              height: '0.04',
              color: '0x00000066',
              fontSize: '16',
            },
          },
          {
            type: 'textField',
            placeHolder: 'Please input filename',
            dataKey: 'newDoc.document.name.title',
            style: {
              left: '0.133',
              top: '0.13',
              width: '0.72',
              height: '0.06',
              fontSize: '16',
              color: '0x000000ff',
              border: {
                style: '2',
                color: '0x000000ef',
              },
              borderWidth: '1',
            },
          },
          {
            '.UploadModule': null,
            onClick: [
              {
                actionType: 'popUp',
                popUpView: 'selectView',
              },
            ],
            style: {
              left: '0.133',
              top: '0.25',
            },
          },
          {
            type: 'label',
            contentType: 'messageHidden',
            text: 'Successful selected',
            style: {
              left: '0.133',
              top: '0.43',
              width: '0.72',
              height: '0.04',
              color: '0x000000',
              fontSize: '16',
              isHidden: 'true',
            },
          },
          {
            type: 'button',
            text: 'Upload',
            onClick: [
              {
                actionType: 'popUp',
                popUpView: 'uploading',
              },
              {
                actionType: 'evalObject',
                object: '..save',
              },
              {
                actionType: 'builtIn',
                funcName: 'goBack',
                reload: true,
              },
            ],
            style: {
              left: '0.133',
              top: '0.73',
              width: '0.72',
              height: '0.07',
              backgroundColor: '0x388eccff',
              color: '0xffffffff',
              textAlign: {
                x: 'center',
              },
            },
          },
        ],
      },
      {
        type: 'popUp',
        viewTag: 'selectView',
        style: {
          left: '0',
          width: '1',
          top: '0',
          height: '1',
          backgroundColor: '0xa9a9a9cc',
        },
        children: [
          {
            type: 'view',
            style: {
              top: '0.59',
              width: '0.9',
              height: '0.275',
              left: '0.05',
              border: {
                style: '1',
              },
              borderRadius: '10',
              backgroundColor: '0xe9e9e9',
              zIndex: 1000,
            },
            children: [
              {
                type: 'label',
                textBoard: [
                  {
                    text: 'Medical Records',
                    color: '0x00000099',
                  },
                  {
                    br: null,
                  },
                  {
                    text: 'Upload an image or document',
                    color: '0x00000066',
                  },
                ],
                style: {
                  top: '0.02',
                  width: '0.9',
                  height: '0.06',
                  fontSize: '10',
                  color: '0x808080ff',
                  textAlign: {
                    x: 'center',
                  },
                  border: {
                    style: '2',
                    width: '0.0001',
                  },
                  borderColor: '0x00000066',
                },
              },
              {
                type: 'button',
                text: 'Camera',
                contentType: 'file',
                onClick: [
                  {
                    actionType: 'updateObject',
                    dataObject: 'BLOB',
                    dataKey: 'AddDocuments.newDoc.document.name.data',
                  },
                  {
                    actionType: 'popUpDismiss',
                    popUpView: 'selectView',
                  },
                  {
                    actionType: 'builtIn',
                    funcName: 'checkField',
                    contentType: 'messageHidden',
                  },
                ],
                style: {
                  top: '0.085',
                  width: '0.9',
                  height: '0.06',
                  fontSize: '18',
                  color: '0x1d88fc',
                  backgroundColor: '0xe9e9e9',
                  textAlign: {
                    x: 'center',
                  },
                  border: {
                    style: '2',
                    width: '0.0001',
                  },
                  borderColor: '0x00000066',
                },
              },
              {
                type: 'button',
                text: 'Photo Library',
                contentType: 'file',
                onClick: [
                  {
                    actionType: 'updateObject',
                    dataObject: 'BLOB',
                    dataKey: 'AddDocuments.newDoc.document.name.data',
                  },
                  {
                    actionType: 'popUpDismiss',
                    popUpView: 'selectView',
                  },
                  {
                    actionType: 'builtIn',
                    funcName: 'checkField',
                    contentType: 'messageHidden',
                  },
                ],
                style: {
                  top: '0.146',
                  width: '0.9',
                  height: '0.06',
                  fontSize: '18',
                  color: '0x1d88fc',
                  backgroundColor: '0xe9e9e9',
                  textAlign: {
                    x: 'center',
                  },
                  border: {
                    style: '2',
                    width: '0.0001',
                  },
                  borderColor: '0x00000066',
                },
              },
              {
                type: 'button',
                text: 'Document Manager',
                contentType: 'file',
                onClick: [
                  {
                    actionType: 'updateObject',
                    dataObject: 'BLOB',
                    dataKey: 'AddDocuments.newDoc.document.name.data',
                  },
                  {
                    actionType: 'popUpDismiss',
                    popUpView: 'selectView',
                  },
                  {
                    actionType: 'builtIn',
                    funcName: 'checkField',
                    contentType: 'messageHidden',
                  },
                ],
                style: {
                  top: '0.206',
                  width: '0.9',
                  height: '0.06',
                  fontSize: '18',
                  color: '0x1d88fc',
                  backgroundColor: '0xe9e9e9',
                  textAlign: {
                    x: 'center',
                  },
                  border: {
                    style: 1,
                  },
                },
              },
            ],
          },
          {
            type: 'button',
            text: 'Cancel',
            style: {
              top: '0.9',
              left: '0.05',
              width: '0.9',
              height: '0.06',
              fontSize: '18',
              color: '0x1d88fc',
              backgroundColor: '0xe9e9e9',
              textAlign: {
                x: 'center',
              },
              borderRadius: '10',
              border: {
                style: 1,
              },
            },
            onClick: [
              {
                actionType: 'popUpDismiss',
                popUpView: 'selectView',
              },
            ],
          },
        ],
      },
    ],
  },
}
