export default {
  ChatPage: {
    title: 'ChatPage',
    init: [
      '.SignInCheck',
      {
        '..chatEdge@': '=.MessageObjStore.currentChatEdge',
      },
      {
        '=..messages.docApi.get': '',
      },
      {
        '..newestMsg@': '=..messages.response.doc.0',
      },
      {
        '..oldestMsg@': '=..messages.response.doc.$',
      },
    ],
    chatEdge: '',
    newestMsg: '',
    oldestMsg: '',
    messages: {
      response: '',
      document: {
        id: '=..chatEdge.refid',
        xfname: 'E.refid',
        obfname: 'D.ctime',
        ObjType: 4,
        maxcount: 2,
      },
      docApi: {
        get: {
          api: 'rd',
          dataOut: 'messages.response',
          dataIn: 'messages.document',
        },
      },
    },
    newTextMessage: {
      document: {
        eid: '=..chatEdge.id',
        subtype: {
          isOnServer: 1,
          isZipped: 0,
          isBinary: 0,
          isEncrypted: 0,
          isExtraKeyNeeded: 0,
          isEditable: 0,
          applicationDataType: 0,
          mediaType: 8,
        },
        type: 769,
        name: {
          title: 'textMessage',
          senderId: '.Global.currentUser.vertex.id',
          senderName: '.Global.currentUser.vertex.name.userName',
          data: {
            text: '',
          },
        },
      },
      docAPI: {
        store: {
          api: 'cd',
          dataIn: 'newTextMessage.document',
        },
      },
    },
    newFileMessage: {
      document: {
        eid: '=..chatEdge.id',
        subtype: {
          isOnServer: 0,
          isZipped: 0,
          isBinary: 0,
          isEncrypted: 0,
          isExtraKeyNeeded: 0,
          isEditable: 0,
          applicationDataType: 0,
          mediaType: 4,
        },
        type: 1025,
        name: {
          title: 'fileMessage',
          senderName: '.Global.currentUser.vertex.name.userName',
          data: {
            text: '',
          },
        },
      },
      docAPI: {
        store: {
          api: 'cd',
          dataKey: 'newDoc.document',
        },
      },
    },
    newMessages: {
      response: '',
      document: {
        '..messages.document': '',
        sCondition: '',
        _nonce: '=.Global._nonce',
      },
      docApi: {
        get: {
          api: 'rd',
          dataIn: 'newMessages.document',
          dataOut: 'newMessages.response',
        },
      },
    },
    oldMessages: {
      response: '',
      document: {
        '..messages.document': '',
        sCondition: '',
      },
      docApi: {
        get: {
          api: 'rd',
          dataIn: 'oldMessages.document',
          dataOut: 'oldMessages.response',
        },
      },
    },
    onNewMessageToDisplay: {
      actionType: 'evalObject',
      object: [
        // {
        //   '=.builtIn.string.concat': {
        //     dataIn: ['ctime>', '=..newestMsg.ctime'],
        //     dataOut: 'ChatPage.newMessages.get.sCondition',
        //   },
        // },
        {
          '.Global._nonce@': {
            '=.builtIn.math.random': '',
          },
        },
        { '=..newMessages.docApi.get': '' },
        {
          '..newestMsg@': '=..newMessages.response.doc.0',
        },
        {
          actionType: 'builtIn',
          funcName: 'insertTo',
          viewTag: 'chatTag',
          newItems: 'newMessages.response.doc',
        },
      ],
    },
    onPullMoreMessage: {
      actionType: 'evalObject',
      object: [
        {
          '=.builtIn.string.concat': {
            dataIn: ['ctime<', '=..oldestMsg.ctime'],
            dataOut: 'oldMessages.document.sCondition',
          },
        },
        { '=..oldMessages.docApi.get': '' },
        {
          '..oldestMsg@': '=..oldMessages.response.doc.$',
        },
        {
          actionType: 'builtIn',
          funcName: 'insertTo',
          viewTag: 'chatTag',
          newItems: 'newMessages.response.doc',
          addToFront: false,
        },
      ],
    },
    components: [
      {
        type: 'register',
        onEvent: 'onNewMessageDisplay',
        emit: {
          dataKey: { var: 'onNewMessageDisplay' },
          actions: ['=..onNewMessageToDisplay'],
        },
      },
      {
        type: 'register',
        onEvent: 'onPullMoreMessage',
        actions: ['=..onPullMoreMessage'],
      },
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
            type: 'view',
            style: {
              left: '0',
              top: '0',
              width: '1',
              height: '0.08',
              backgroundColor: '0x388eccff',
            },
            children: [
              {
                type: 'view',
                style: {
                  left: '0.0582',
                  top: '0.01',
                  width: '0.18667',
                  height: '0.05',
                },
                onClick: [
                  {
                    actionType: 'pageJump',
                    destination: 'ChatList',
                  },
                ],
                children: [
                  {
                    type: 'image',
                    path: 'backWhiteArrow.png',
                    style: {
                      left: '0',
                      top: '0.01',
                      width: '0.053333',
                      height: '0.03',
                      color: '0xffffffff',
                      backgroundColor: '0x388eccff',
                    },
                  },
                  {
                    type: 'label',
                    text: 'Back',
                    style: {
                      left: '0.0667',
                      top: '0.0',
                      width: '0.12',
                      height: '0.05',
                      fontSize: '18',
                      color: '0xffffffff',
                      backgroundColor: '0x388eccff',
                    },
                  },
                ],
              },
              {
                type: 'label',
                text: 'ChatPage',
                style: {
                  left: '0.25',
                  top: '0.02',
                  width: '0.5',
                  height: '0.03405',
                  fontSize: '18',
                  display: 'inline',
                  color: '0xffffffff',
                  backgroundColor: '0x388eccff',
                  textAlign: {
                    x: 'center',
                    y: 'center',
                  },
                },
              },
              {
                type: 'label',
                text: 'Add a member',
                style: {
                  left: '0.78',
                  top: '0.02',
                  width: '0.12',
                  height: '0.03405',
                  fontSize: '20',
                  display: 'inline',
                  color: '0xffffffff',
                  backgroundColor: '0x388eccff',
                  textAlign: {
                    x: 'center',
                    y: 'center',
                  },
                },
                onClick: [
                  {
                    goto: 'ChatInviteeInfo2',
                  },
                ],
              },
            ],
          },
          {
            type: 'chatList',
            viewTag: 'chatTag',
            contentType: 'listObject',
            listObject: '..messages.response.doc',
            iteratorVar: 'itemObject',
            style: {
              left: '0',
              top: '0.08',
              width: '1',
              height: '0.72',
            },
            chatItem: {
              style: {
                left: '0',
                top: '0',
                width: '1',
                height: '0.15',
                border: {
                  style: '2',
                },
                borderWidth: '1',
                borderColor: '0x00000011',
              },
            },
          },
          {
            type: 'textField',
            viewTag: 'textInput',
            contentType: 'text',
            placeholder: 'Write here',
            dataKey: 'newTextMessage.document.name.data.text',
            style: {
              textAlign: {
                x: 'left',
              },
              fontSize: '14',
              left: '0.1',
              top: '0.8',
              width: '0.8',
              height: '0.08',
              borderWidth: '1',
              border: {
                style: '2',
              },
            },
          },
          {
            type: 'button',
            text: 'Send',
            onClick: [
              {
                actionType: 'evalObject',
                object: [
                  {
                    '=..newTextMessage.docAPI.store': '',
                  },
                  {
                    '..newTextMessage.document.name.data.text@': '',
                  },
                  {
                    '=.builtIn.object.clear': {
                      dataIn: {
                        object: '=..newTextMessage.document.name.data.text',
                      },
                    },
                  },
                ],
              },
              '=..onNewMessageToDisplay',
              {
                actionType: 'builtIn',
                funcName: 'clearText',
                viewTag: 'textInput',
              },
            ],
            style: {
              color: '0xffffffff',
              fontSize: '16',
              fontStyle: 'bold',
              left: '0.1',
              top: '0.9',
              width: '0.25',
              height: '0.07',
              backgroundColor: '0x388eccff',
              border: {
                style: '1',
              },
              display: 'inline',
              textAlign: {
                x: 'center',
                y: 'center',
              },
            },
          },
          {
            type: 'button',
            text: 'Upload',
            contentType: 'file',
            onClick: [
              {
                actionType: 'evalObject',
                object: [
                  {
                    actionType: 'openDocumentManager',
                    dataObject: 'BLOB',
                    dataKey: 'newFileMessage.document.name.data',
                  },
                  {
                    '=..newFileMessage.docAPI.store': '',
                  },
                ],
              },
              '=..onNewMessageToDisplay',
            ],
            style: {
              color: '0xffffffff',
              fontSize: '16',
              fontStyle: 'bold',
              left: '0.55',
              top: '0.9',
              width: '0.25',
              height: '0.07',
              backgroundColor: '0x388eccff',
              border: {
                style: '1',
              },
              display: 'inline',
              textAlign: {
                x: 'center',
                y: 'center',
              },
            },
          },
        ],
      },
    ],
  },
}
