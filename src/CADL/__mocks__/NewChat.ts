export default {
  NewChat: {
    init: [
      '.SignInCheck',
      {
        if: [
          '=.MessageObjStore.newChatInfo.rootChat',
          {
            actionType: 'evalObject',
            object: [
              {
                '..contacts.get.id@':
                  '=.MessageObjStore.newChatInfo.rootChat.id',
              },
              {
                '=..contacts.get': '',
              },
            ],
          },
          'continue',
        ],
      },
      {
        if: [
          '=.MessageObjStore.newChatInfo.bufferChat',
          {
            actionType: 'evalObject',
            object: {
              '=.builtIn.array.add': {
                dataIn: {
                  object: '=..contacts.response.edge',
                  value: '=.MessageObjStore.newChatInfo.bufferChat',
                },
              },
            },
          },
          'continue',
        ],
      },
    ],
    contacts: {
      response: {
        edge: [],
      },
      get: {
        '.EdgeAPI.get': '',
        id: '',
        type: 1091,
        xfname: 'refid | id',
        maxcount: '20',
        obfname: 'mtime',
        dataOut: 'contacts.response',
      },
    },
    inviteToChat: {
      response: '',
      edge: {
        id: '',
        type: 1091,
        refid: '',
        name: {
          phoneNumber: '',
          firstName: '',
          lastName: '',
          fullName: '',
          InviterName: '.Global.currentUser.vertex.name.userName',
        },
        subType: 1,
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataIn: 'inviteToChat.edge',
          dataOut: 'inviteToChat.response',
        },
      },
    },
    components: [
      {
        '.BaseCheckView': '',
        message: 'Invite someone first to chat',
        viewTag: 'noChatInvited',
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
                text: 'NewChat',
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
            ],
          },
          {
            type: 'button',
            text: 'Add Member',
            style: {
              color: '0xffffffff',
              fontSize: '16',
              fontStyle: 'bold',
              left: '0.1',
              top: '0.15',
              width: '0.35',
              height: '0.06',
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
            onClick: [
              {
                actionType: 'evalObject',
                object: [
                  {
                    if: [
                      '=.MessageObjStore.newChatInfo.bufferChat',
                      {
                        actionType: 'evalObject',
                        object: [
                          {
                            '..inviteToChat.edge@':
                              '=.MessageObjStore.newChatInfo.bufferChat',
                          },
                          {
                            '..inviteToChat.edge.subType@': 1,
                          },
                          {
                            '=..inviteToChat.edgeAPI.store': '',
                          },
                          {
                            '.MessageObjStore.newChatInfo.rootChat@':
                              '=..inviteToChat.response.edge',
                          },
                          {
                            '.MessageObjStore.newChatInfo.bufferChat@': '',
                          },
                        ],
                      },
                      'continue',
                    ],
                  },
                ],
              },
              {
                goto: 'ChatInviteeInfo',
              },
            ],
          },
          {
            type: 'button',
            text: 'Start Chat',
            style: {
              color: '0xffffffff',
              fontSize: '16',
              fontStyle: 'bold',
              left: '0.5',
              top: '0.15',
              width: '0.35',
              height: '0.06',
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
            onClick: [
              {
                actionType: 'evalObject',
                object: [
                  {
                    if: [
                      '=.MessageObjStore.newChatInfo.bufferChat',
                      {
                        actionType: 'evalObject',
                        object: [
                          {
                            '..inviteToChat.edge@':
                              '=.MessageObjStore.newChatInfo.bufferChat',
                          },
                          {
                            '..inviteToChat.edge.subType@': 0,
                          },
                          {
                            '=..inviteToChat.edgeAPI.store': '',
                          },
                          {
                            '.MessageObjStore.currentChatEdge@':
                              '=..inviteToChat.response.edge',
                          },
                        ],
                      },
                      {
                        '.MessageObjStore.currentChatEdge@':
                          '=.MessageObjStore.newChatInfo.rootChat',
                      },
                    ],
                  },
                ],
              },
              {
                actionType: 'evalObject',
                object: [
                  {
                    if: [
                      '=.MessageObjStore.currentChatEdge',
                      {
                        actionType: 'evalObject',
                        object: [
                          {
                            '.MessageObjStore.newChatInfo.rootChat@': '',
                          },
                          {
                            '.MessageObjStore.newChatInfo.bufferChat@': '',
                          },
                          {
                            '=.builtIn.goto': {
                              dataIn: { destination: 'ChatPage' },
                            },
                          },
                        ],
                      },
                      {
                        actionType: 'popUp',
                        popUpView: 'noChatInvited',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'list',
            contentType: 'listObject',
            listObject: '..contacts.response.edge',
            iteratorVar: 'itemObject',
            style: {
              left: '0',
              top: '0.25',
              width: '1',
              height: '0.72',
            },
            children: [
              {
                type: 'listItem',
                itemObject: '',
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
                children: [
                  {
                    type: 'label',
                    dataKey: 'itemObject.name.InviteePhoneNumber',
                    style: {
                      left: '0.25',
                      top: '0.06',
                      width: '0.74',
                      height: '0.03',
                      fontSize: '18',
                      color: '0x000000ff',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
}
