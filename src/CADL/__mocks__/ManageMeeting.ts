export default {
  ManageMeeting: {
    pageNumber: '260',
    title: 'Manage Meeting',
    lobbyRoom: {
      response: '',
      edge: '',
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataKey: 'lobbyRoom.edge',
        },
      },
    },
    listData: {
      response: {
        edge: null,
      },
      edge: {
        '.Edge': '',
        id: '.Global.VideoChatObjStore.reference.edge.refid',
        type: 1053,
        xfname: 'refid',
        maxcount: '20',
        sCondition: 'tage=0 AND ctime>UNIX_TIMESTAMP()-7200',
      },
      get: {
        '.EdgeAPI.get': '',
        api: 're',
        dataIn: 'listData.edge',
        dataOut: 'listData.response',
        nonce: '.Global._nonce',
      },
    },
    inviteesInfo: {
      response: '',
      edge: {
        '.Edge': '',
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataIn: 'inviteesInfo.edge',
          dataOut: 'inviteesInfo.response',
        },
      },
    },
    init: [
      {
        if: [
          '=.Global.currentUser.vertex.sk',
          'continue',
          {
            goto: 'SignIn',
          },
        ],
      },
      {
        actionType: 'evalObject',
        object: {
          '.ManageMeeting.lobbyRoom.edge@': '=.Global.rootRoomInfo.edge',
        },
      },
      '..listData.get',
    ],
    save: ['.ManageMeeting.lobbyRoom.edgeAPI.store'],
    update: ['..inviteesInfo.edgeAPI.store'],
    components: [
      {
        type: 'view',
        style: {
          left: '0',
          top: '0',
          width: '1',
          height: '0.94',
        },
        children: [
          {
            type: 'view',
            style: {
              left: '0',
              top: '0',
              width: '1',
              height: '0.2',
              backgroundColor: '0x388eccff',
            },
            children: [
              {
                '.BaseHeader3': null,
              },
              {
                '.HeaderLeftButton': null,
                onClick: [
                  {
                    actionType: 'evalObject',
                    object: {
                      '.Global._nonce@': {
                        '=.builtIn.math.random': '',
                      },
                    },
                  },
                  {
                    actionType: 'evalObject',
                    object: {
                      '=.builtIn.goto': {
                        dataIn: {
                          destination: 'VideoChat',
                          reload: false,
                        },
                      },
                    },
                  },
                ],
              },
              {
                type: 'label',
                text: 'Title',
                style: {
                  color: '0xffffffff',
                  left: '0.05',
                  top: '0.1',
                  width: '0.6',
                  height: '0.04',
                  fontSize: '16',
                },
              },
              {
                type: 'textField',
                contentType: 'label',
                placeholder: 'Please type the title here',
                dataKey: 'lobbyRoom.edge.name.roomName',
                style: {
                  left: '0.05',
                  top: '0.14',
                  width: '0.9',
                  height: '0.041',
                  color: '0xffffffff',
                  backgroundColor: '0x00000000',
                  textAlign: {
                    x: 'left',
                  },
                  fontSize: '14',
                  required: 'true',
                  borderWidth: '1',
                  borderColor: '0xffffffff',
                  border: {
                    style: '2',
                  },
                },
              },
            ],
          },
          {
            type: 'view',
            style: {
              top: '0.22',
              left: '0',
            },
            children: [
              {
                type: 'view',
                style: {
                  top: '0',
                  left: '0',
                  width: '0.5',
                  height: '0.2',
                },
                children: [
                  {
                    type: 'image',
                    path: 'add.file.png',
                    style: {
                      top: '0',
                      left: '0.16',
                      width: '0.19',
                      height: '0.1',
                      zIndex: 10,
                    },
                    onClick: [
                      {
                        goto: 'UploadSharedDocuments2',
                      },
                    ],
                  },
                  {
                    type: 'label',
                    text: 'Uploaded Document',
                    style: {
                      top: '0.1',
                      left: '0.01',
                      width: '0.5',
                      height: '0.05',
                      fontSize: 14,
                      fontWeight: 400,
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  top: '0',
                  left: '0.5',
                  width: '0.5',
                  height: '0.2',
                },
                children: [
                  {
                    type: 'image',
                    path: 'invite.user.png',
                    style: {
                      top: '0',
                      left: '0.16',
                      width: '0.19',
                      height: '0.1',
                      zIndex: 10,
                    },
                    onClick: [
                      {
                        goto: 'UploadFavorite2',
                      },
                    ],
                  },
                  {
                    type: 'label',
                    text: 'Invite',
                    style: {
                      top: '0.1',
                      left: '0.09',
                      width: '0.3',
                      height: '0.05',
                      fontSize: 14,
                      fontWeight: 400,
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                ],
              },
              {
                type: 'label',
                text: 'Meeting Participants',
                style: {
                  top: '0.14',
                  left: '0',
                  width: '1',
                  height: '0.05',
                  fontSize: 20,
                  color: '0x00000099',
                  textAlign: {
                    x: 'center',
                  },
                  border: {
                    style: '2',
                  },
                  borderColor: '0x00000044',
                  borderWidth: '0.001px',
                },
              },
              {
                type: 'label',
                dataKey: 'ManageMeeting.lobbyRoom.edge.name.hostName',
                style: {
                  left: '0.1',
                  top: '0.21',
                  width: '0.7',
                  height: '0.03',
                  fontSize: '18',
                  fontStyle: 'bold',
                  color: '0x000000ff',
                },
              },
              {
                type: 'label',
                text: 'Organizer',
                style: {
                  left: '0.7',
                  top: '0.21',
                  width: '0.18',
                  height: '0.04',
                  fontSize: '18',
                  color: '0x000000ff',
                  fontStyle: 'bold',
                  display: 'inline',
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
          {
            type: 'list',
            contentType: 'listObject',
            listObject: '..listData.response.edge',
            iteratorVar: 'itemObject',
            style: {
              left: '0',
              top: '0.47',
              width: '1',
              height: '0.48',
            },
            children: [
              {
                type: 'listItem',
                itemObject: '',
                style: {
                  left: '0',
                  width: '1',
                  height: '0.10',
                  border: {
                    style: '1',
                  },
                  textAlign: {
                    y: 'center',
                  },
                },
                children: [
                  {
                    type: 'label',
                    dataKey: 'itemObject.name.fullName',
                    style: {
                      left: '0.1',
                      width: '0.7',
                      height: '0.03',
                      fontSize: '18',
                      fontStyle: 'bold',
                      color: '0x000000ff',
                    },
                  },
                  {
                    type: 'button',
                    onClick: [
                      {
                        actionType: 'updateObject',
                        dataKey: 'ManageMeeting.inviteesInfo.edge',
                        dataObject: 'itemObject',
                      },
                      {
                        actionType: 'evalObject',
                        object: {
                          '.ManageMeeting.inviteesInfo.edge.tage@': -1,
                        },
                      },
                      {
                        actionType: 'evalObject',
                        object: [
                          {
                            '=.ManageMeeting.inviteesInfo.edgeAPI.store': '',
                          },
                        ],
                      },
                      {
                        actionType: 'refresh',
                      },
                    ],
                    text: 'Remove',
                    style: {
                      left: '0.69',
                      top: '0.037',
                      width: '0.2',
                      height: '0.04',
                      fontSize: '14',
                      color: '0xffffffff',
                      backgroundColor: '0xd53d42ff',
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
        ],
      },
      {
        type: 'popUp',
        viewTag: 'warningView',
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
              top: '0.2',
              width: '0.89333',
              height: '0.3',
              backgroundColor: '0xeeeeeeff',
              border: {
                style: '5',
              },
              borderRadius: '15',
            },
            children: [
              {
                type: 'label',
                text: 'OOPS',
                style: {
                  '.LabelStyle': {
                    left: '0',
                    top: '0.04',
                    width: '0.89333',
                    height: '0.027247',
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
                text: 'There is no title of meeting',
                style: {
                  '.LabelStyle': {
                    left: '0',
                    top: '0.12',
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
                type: 'divider',
                style: {
                  '.DividerStyle': {
                    left: '0',
                    top: '0.20436',
                    width: '0.89333',
                    backgroundColor: '0x00000088',
                  },
                },
              },
              {
                type: 'button',
                onClick: [
                  {
                    actionType: 'popUpDismiss',
                    popUpView: 'warningView',
                  },
                ],
                text: 'OK',
                style: {
                  '.LabelStyle': {
                    left: '0',
                    top: '0.225',
                    width: '0.89333',
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
            ],
          },
        ],
      },
    ],
  },
}
