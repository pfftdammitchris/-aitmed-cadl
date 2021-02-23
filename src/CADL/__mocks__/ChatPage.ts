export default {
  ChatPage: {
    title: 'ChatPage',
    init: [
      '.SignInCheck',
      {
        '..chatEdge@': '=.MessageObjStore.currentChatEdge',
      },
      { '=..messages.get': '' },
    ],
    chatEdge: '',
    firstMsg: '',
    lastMsg: '',
    messages: {
      respond: '',
      get: {
        id: '=..chatEdge.refid',
        api: 'rd',
        xfname: 'E.refid',
        obfname: 'D.ctime',
        ObjType: 4,
        maxcount: 50,
        dataOut: 'messages.respond',
      },
    },
    newTextMessage: {
      document: {
        eid: '=.ChatPage.chatEdge.id',
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
      respond: '',
      get: {
        '..messages.get': '',
        dataOut: 'newMessages.respond',
        sCondition: {
          '.builtIn.string.concat': ['ctime>', '=..firstMsg.ctime'],
        },
      },
    },
    moreOldMessages: {
      respond: '',
      get: {
        '..messages': '',
        loid: '..lastMsg.id',
        dataOut: 'moreOlderMessages.respond',
      },
    },
    onNewMessageReceived: [
      {
        evolve: 'newMessages',
      },
      '=..newMessages.get',
      {
        '=.builtIn.array.push': {
          dataIn: {
            object: '=.ChatPage.newMessages.respond.doc',
          },
          dataOut: {
            object: '=.ChatPage.messages.respond.doc',
          },
        },
      },
      {
        '=.firstMsg@': '=.ChatPage.messages.respond.doc.0',
      },
    ],
    onPullMoreMessage: [
      {
        evolve: 'moreOldMessage.get',
      },
      '=..moreOlderMessages.get',
      {
        '=.builtIn.array.append': {
          dataIn: {
            object: '=.ChatPage.moreOldMessages.respond.doc',
          },
          dataOut: {
            object: '=.ChatPage.messages.respond.doc',
          },
        },
      },
      '=..lastMsg@:=.ChatPage.messages.respond.doc.$',
    ],
    components: [
      {
        type: 'register',
        onEvent: 'onFCMReceived',
        actions: ['=..onNewMessageReceived'],
      },
      {
        type: 'register',
        onEvent: 'onPullDown',
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
            contentType: 'listObject',
            listObject: '..messages.respond.doc',
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
                    '=.ChatPage.newTextMessage.docAPI.store': '',
                  },
                  {
                    '..newTextMessage.document.name.data.text@': '',
                  },
                  {
                    event: 'onPullDown',
                  },
                ],
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
                actionType: 'openDocumentManager',
                dataObject: 'BLOB',
                dataKey: 'newFileMessage.document.name.data',
              },
              {
                '=..newFileMessage.docAPI.store': '',
              },
              {
                event: 'onPullDown',
              },
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
