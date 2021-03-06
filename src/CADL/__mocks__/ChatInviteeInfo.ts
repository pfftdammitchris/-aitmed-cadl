export default {
  ChatInviteeInfo: {
    module: 'meetingroom',
    title: 'ChatInviteeInfo',
    pageNumber: '140',
    init: ['.SignInCheck'],
    save: [
      {
        '=..inviteToChat.edgeAPI.store': '',
      },
    ],
    inviteToChat: {
      edge: {
        id: '',
        type: 1091,
        refid: '',
        name: {
          InviteePhoneNumber: '',
          firstName: '',
          lastName: '',
          fullName: '',
          InviterName: '.Global.currentUser.vertex.name.userName',
        },
        subtype: 1,
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataIn: 'inviteToChat.edge',
        },
      },
    },
    components: [
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
          top: '0.12',
          width: '1',
          height: '0.35',
        },
        children: [
          {
            type: 'label',
            text: 'Phone #',
            style: {
              left: '0.1333',
              top: '0.05',
              width: '0.72',
              height: '0.03',
              fontSize: '16',
            },
          },
          {
            type: 'textField',
            dataKey: 'inviteToChat.edge.name.InviteePhoneNumber',
            contentType: 'phone',
            style: {
              left: '0.1333',
              top: '0.09',
              width: '0.72',
              height: '0.03',
              fontSize: '19',
              color: '0x707070ff',
              border: {
                style: '2',
                color: '0x707070ff',
              },
              borderWidth: '1',
            },
          },
          {
            type: 'label',
            text: 'First Name:',
            style: {
              left: '0.1333',
              top: '0.155',
              width: '0.72',
              height: '0.03',
              fontSize: '16',
            },
          },
          {
            type: 'textField',
            dataKey: 'inviteToChat.edge.name.firstName',
            contentType: 'text',
            style: {
              left: '0.1333',
              top: '0.195',
              width: '0.72',
              height: '0.03',
              fontSize: '19',
              color: '0x707070ff',
              border: {
                style: '2',
                color: '0x707070ff',
              },
              borderWidth: '1',
            },
          },
          {
            type: 'label',
            text: 'Last Name:',
            style: {
              left: '0.1333',
              top: '0.26',
              width: '0.72',
              height: '0.03',
              fontSize: '16',
            },
          },
          {
            type: 'textField',
            dataKey: 'inviteToChat.edge.name.lastName',
            contentType: 'text',
            style: {
              left: '0.1333',
              top: '0.3',
              width: '0.72',
              height: '0.03',
              fontSize: '19',
              color: '0x707070ff',
              border: {
                style: '2',
                color: '0x707070ff',
              },
              borderWidth: '1',
            },
          },
        ],
      },
      {
        type: 'button',
        onClick: [
          {
            actionType: 'popUp',
            popUpView: 'confirmView',
          },
        ],
        text: 'Invite',
        style: {
          left: '0.1',
          top: '0.75',
          width: '0.8',
          height: '0.05',
          color: '0xffffffff',
          fontSize: '19',
          backgroundColor: '0x388eccff',
          textAlign: {
            x: 'center',
          },
          border: {
            style: '1',
          },
        },
      },
      {
        type: 'popUp',
        viewTag: 'confirmView',
        style: {
          left: '0',
          top: '0',
          width: '1',
          height: '1',
          backgroundColor: '0x00000066',
        },
        children: [
          {
            type: 'view',
            style: {
              left: '0.05',
              top: '0.15',
              width: '0.89333',
              height: '0.35',
              backgroundColor: '0xeeeeeeff',
              border: {
                style: '5',
              },
              borderRadius: '15',
            },
            children: [
              {
                type: 'label',
                text: 'Send Invite Link',
                style: {
                  '.LabelStyle': {
                    left: '0',
                    top: '0.04',
                    width: '0.89333',
                    height: '0.04',
                    color: '0x00000088',
                    fontSize: '20',
                    fontStyle: 'bold',
                    display: 'inline',
                    textAlign: {
                      x: 'center',
                      y: 'center',
                    },
                  },
                },
              },
              {
                type: 'label',
                text: 'Send invite link to',
                style: {
                  '.LabelStyle': {
                    left: '0',
                    top: '0.1',
                    width: '0.89333',
                    height: '0.04',
                    color: '0x00000088',
                    fontSize: '14',
                    display: 'inline',
                    textAlign: {
                      x: 'center',
                      y: 'center',
                    },
                  },
                },
              },
              {
                type: 'label',
                dataKey: 'inviteToChat.edge.name.firstName',
                style: {
                  '.LabelStyle': {
                    left: '0',
                    top: '0.15',
                    width: '0.89333',
                    height: '0.027247',
                    color: '0x00000088',
                    fontSize: '14',
                    display: 'inline',
                    textAlign: {
                      x: 'center',
                      y: 'center',
                    },
                  },
                },
              },
              {
                type: 'label',
                dataKey: 'inviteToChat.edge.name.InviteePhoneNumber',
                style: {
                  '.LabelStyle': {
                    left: '0',
                    top: '0.20',
                    width: '0.89333',
                    height: '0.027247',
                    color: '0x00000088',
                    fontSize: '14',
                    display: 'inline',
                    textAlign: {
                      x: 'center',
                      y: 'center',
                    },
                  },
                },
              },
              {
                type: 'divider',
                style: {
                  '.DividerStyle': {
                    left: '0',
                    top: '0.25436',
                    width: '0.89333',
                    height: '0.001',
                    backgroundColor: '0x00000088',
                  },
                },
              },
              {
                type: 'button',
                onClick: [
                  {
                    actionType: 'popUpDismiss',
                    popUpView: 'confirmView',
                  },
                ],
                text: 'Cancel',
                style: {
                  '.LabelStyle': {
                    left: '0',
                    top: '0.275',
                    width: '0.42',
                    height: '0.06812',
                    color: '0x007affff',
                    fontSize: '17',
                    display: 'inline',
                    textAlign: {
                      x: 'center',
                      y: 'center',
                    },
                    border: {
                      style: '5',
                    },
                    borderRadius: '15',
                  },
                },
              },
              {
                type: 'button',
                onClick: [
                  {
                    actionType: 'evalObject',
                    object: {
                      '=.builtIn.string.concat': {
                        dataIn: [
                          '=..inviteToChat.edge.name.firstName',
                          ' ',
                          '=..inviteToChat.edge.name.lastName',
                        ],
                        dataOut:
                          'ChatInviteeInfo.inviteToChat.edge.name.fullName',
                      },
                    },
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        if: [
                          '=.MessageObjStore.newChatInfo.rootChat',
                          {
                            actionType: 'evalObject',
                            object: [
                              {
                                '..inviteToChat.edge.refid@':
                                  '=.MessageObjStore.newChatInfo.rootChat.id',
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
                            ],
                          },
                          {
                            actionType: 'evalObject',
                            object: {
                              '.MessageObjStore.newChatInfo.bufferChat@':
                                '=..inviteToChat.edge',
                            },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    actionType: 'popUpDismiss',
                    popUpView: 'confirmView',
                  },
                  {
                    goto: 'NewChat',
                  },
                ],
                text: 'Confirm',
                style: {
                  '.LabelStyle': {
                    left: '0.45',
                    top: '0.275',
                    width: '0.42',
                    height: '0.06812',
                    color: '0x007affff',
                    fontSize: '17',
                    display: 'inline',
                    textAlign: {
                      x: 'center',
                      y: 'center',
                    },
                    border: {
                      style: '5',
                    },
                    borderRadius: '15',
                  },
                },
              },
              {
                type: 'divider',
                style: {
                  '.DividerStyle': {
                    left: '0.45',
                    top: '0.26',
                    width: '0.001',
                    height: '0.07',
                    backgroundColor: '0x00000088',
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
}
