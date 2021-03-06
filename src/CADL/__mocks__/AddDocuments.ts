export default {
  AddDocuments: {
    pageNumber: '430 440',
    title: 'Upload Documents',
    init: ['.SignInCheck'],
    save: [
      {
        '=.AddDocuments.newDoc.docAPI.store': '',
      },
      {
        if: [
          '=.AddDocuments.newDoc.document.id',
          {
            '.Global.DocReference.document@': '=.AddDocuments.newDoc.document',
          },
          {
            '.Global.DocReference.document@':
              '=.AddDocuments.newDoc.document.doc',
          },
        ],
      },
    ],
    newDoc: {
      document: {
        '.Document': '',
        subtype: {
          isEncrypted: '0',
          isOnServer: '0',
        },
        type: '.DocType.UploadFile',
        name: {
          title: '',
          type: '..newDoc.docAPI.store.subtype.mediaType',
          data: 'binFile',
          user: '.Global.currentUser.vertex.name.fullName',
          targetRoomName: '',
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
    newSign: {
      document: {
        '.Document': '',
        type: '.DocType.DocumentSignature',
        name: {
          title: '',
          type: '..newSign.document.subtype.mediaType',
          data: '',
        },
        eid: '.Global.rootNotebookID',
        fid: '',
        subtype: {
          mediaType: '',
        },
      },
      docAPI: {
        '.DocAPI': '',
        store: {
          api: 'cd',
          dataKey: 'newSign.document',
        },
      },
    },
    components: [
      {
        '.BaseCheckView': '',
        message: 'Please input document title',
        viewTag: 'noTitle',
      },
      {
        type: 'popUp',
        viewTag: 'uploading',
        style: {
          left: '0',
          width: '1',
          height: '1',
          top: '0',
          backgroundColor: '0xa9a9a9',
          zIndex: '10',
        },
        children: [
          {
            type: 'view',
            style: {
              width: '0.76',
              height: '0.2',
              top: '0.3',
              left: '0.12',
              zIndex: '100',
              backgroundColor: '0xe9e9e9',
              borderRadius: '7',
            },
            children: [
              {
                type: 'image',
                path: 'uploading.png',
                style: {
                  left: '0.05',
                  width: '0.2',
                  top: '0.03',
                },
              },
              {
                type: 'label',
                text: 'Uploading...',
                style: {
                  left: '0.29',
                  top: '0.04',
                  width: '0.42',
                  height: '0.07',
                  fontSize: '22',
                  fontWeight: '500',
                },
              },
              {
                type: 'label',
                textBoard: [
                  {
                    text: 'This may take a little while',
                  },
                  {
                    br: null,
                  },
                  {
                    text: 'depending on the file size',
                  },
                ],
                style: {
                  left: '0.12',
                  width: '0.62',
                  top: '0.135',
                  fontSize: '13',
                  height: '0.05',
                  textAlign: {
                    x: 'center',
                  },
                },
              },
            ],
          },
        ],
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
            text: 'Fill out required fields*',
            style: {
              top: '0.02',
              width: '1',
              height: '0.01',
              fontSize: '14',
              color: '0xD53C42',
              textAlign: {
                x: 'center',
              },
            },
          },
          {
            type: 'label',
            textBoard: [
              {
                text: 'Create document name',
              },
              {
                text: '*',
                color: '0xD53C42',
              },
            ],
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
              textIndent: '10px',
              textAlign: {
                x: 'left',
              },
            },
          },
          {
            type: 'label',
            textBoard: [
              {
                text: 'Upload your document',
              },
              {
                text: '*',
                color: '0xD53C42',
              },
            ],
            style: {
              left: '0.133',
              top: '0.225',
              width: '0.72',
              height: '0.04',
              color: '0x00000066',
              fontSize: '16',
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
              top: '0.3',
            },
          },
          {
            type: 'label',
            text: 'Signature:',
            style: {
              left: '0.133',
              top: '0.58',
              width: '0.43',
              fontSize: '14',
              height: 'auto',
              color: '0x000000',
              textAlign: {
                y: 'center',
              },
            },
          },
          {
            type: 'label',
            text: 'clear',
            onClick: [
              {
                actionType: 'removeSignature',
                dataObject: 'BLOB',
                dataKey: 'AddDocuments.newSign.document.name.data',
              },
            ],
            style: {
              left: '0.76',
              top: '0.58',
              width: '0.2',
              fontSize: '14',
              height: 'auto',
              color: '0xD53C42',
              textAlign: {
                y: 'center',
              },
            },
          },
          {
            type: 'view',
            style: {
              width: '0.7',
              height: '0.12',
              border: {
                style: '4',
                width: '1.5',
                color: '0xacacac',
              },
              left: '0.133',
              top: '0.62',
            },
            children: [
              {
                type: 'canvas',
                dataKey: 'AddDocuments.newSign.document.name.data',
                style: {
                  left: '0',
                  width: '1',
                  top: '0',
                  height: 'auto',
                  overflow: 'scroll',
                },
              },
            ],
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
            type: 'label',
            textBoard: [
              {
                text: 'Only the following file types are supported: ',
              },
              {
                br: null,
              },
              {
                text: ' .jpeg, .png, .pdf, .xls, .pptx, .ppt, .docx, .doc, .numbers, .pages, .htm',
              },
            ],
            style: {
              left: '0.133',
              top: '0.48',
              width: '0.72',
              height: '0.1',
              color: '0x00000088',
              fontSize: '13',
              textAlign: {
                x: 'left',
              },
            },
          },
          {
            type: 'button',
            text: 'Upload',
            onClick: [
              {
                actionType: 'evalObject',
                object: [
                  {
                    if: [
                      '=..newDoc.document.name.title',
                      'continue',
                      {
                        actionType: 'popUp',
                        popUpView: 'noTitle',
                        wait: true,
                      },
                    ],
                  },
                ],
              },
              {
                actionType: 'saveSignature',
                dataObject: 'BLOB',
                dataKey: 'AddDocuments.newSign.document.name.data',
              },
              {
                actionType: 'popUp',
                popUpView: 'uploading',
              },
              {
                actionType: 'evalObject',
                object: '..save',
              },
              {
                actionType: 'evalObject',
                object: [
                  {
                    '.AddDocuments.newSign.document.fid@':
                      '=.Global.DocReference.document.id',
                  },
                  {
                    '=.AddDocuments.newSign.docAPI.store': '',
                  },
                ],
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
                actionType: 'builtIn',
                funcName: 'goBack',
                reload: true,
              },
            ],
            style: {
              left: '0.133',
              top: '0.8',
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
                    actionType: 'openCamera',
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
                    actionType: 'openPhotoLibrary',
                    dataObject: 'BLOB',
                    dataKey: 'AddDocuments.newDoc.document.name.data',
                  },
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
                    actionType: 'openDocumentManager',
                    dataObject: 'BLOB',
                    dataKey: 'AddDocuments.newDoc.document.name.data',
                  },
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
