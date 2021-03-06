export default {
  MeetingLobby: {
    module: 'meetingroom',
    pageNumber: '160_110',
    title: 'Meeting Lobby',
    rootRoom: {
      response: '',
      edge: '',
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataKey: 'rootRoom.edge',
        },
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
      '.SignInCheck',
      {
        actionType: 'evalObject',
        object: {
          '.MeetingLobby.rootRoom.edge@': '=.Global.rootRoomInfo.edge',
        },
      },
      '..listData.get',
    ],
    save: ['..rootRoom.edgeAPI.store'],
    listData: {
      response: {
        edge: null,
      },
      edge: {
        '.Edge': '',
        id: '.MeetingLobby.rootRoom.edge.id',
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
      },
    },
    components: [
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
            onClick: [
              {
                goto: 'MeetingRoomCreate',
              },
            ],
          },
          {
            type: 'view',
            style: {
              left: '0',
              top: '0.09',
              width: '1',
              height: '0.15',
              backgroundColor: '0x388eccff',
            },
            children: [
              {
                type: 'label',
                text: 'Title',
                style: {
                  color: '0xffffffff',
                  left: '0.05',
                  top: '0.03',
                  width: '0.6',
                  fontWeight: 400,
                  height: '0.04',
                  fontSize: '16',
                },
              },
              {
                type: 'textField',
                contentType: 'text',
                placeholder: 'Please type the title here',
                dataKey: 'rootRoom.edge.name.roomName',
                style: {
                  left: '0.05',
                  top: '0.08',
                  width: '0.9',
                  height: '0.04',
                  color: '0x99C5E5',
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
              {
                type: 'label',
                text: 'Save',
                style: {
                  top: '0.08',
                  left: '0.8',
                  height: '0.04',
                  textAlign: {
                    y: 'center',
                  },
                  color: '0xffffff',
                },
                onClick: [
                  {
                    actionType: 'updateObject',
                    dataKey: 'Global.rootRoomInfo.edge.name.roomName',
                    dataObject: '..rootRoom.edge.name.roomName',
                  },
                  {
                    actionType: 'saveObject',
                    object: '..save',
                  },
                  {
                    goto: 'MeetingRoomCreate',
                  },
                ],
              },
            ],
          },
          {
            type: 'view',
            style: {
              top: '0.28',
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
                    onClick: [
                      {
                        goto: 'UploadSharedDocuments',
                      },
                    ],
                    style: {
                      top: '0',
                      left: '0.165',
                      width: '0.17',
                    },
                  },
                  {
                    type: 'label',
                    text: 'Meeting Documents',
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
                    onClick: [
                      {
                        goto: 'InviteeInfo01',
                      },
                    ],
                    style: {
                      top: '0',
                      left: '0.165',
                      width: '0.17',
                    },
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
                type: 'view',
                style: {
                  top: '0.14',
                  left: '0',
                  width: '1',
                  height: '0.05',
                  fontSize: 13,
                },
              },
              {
                type: 'list',
                contentType: 'listObject',
                listObject: '..listData.response.edge',
                iteratorVar: 'itemObject',
                style: {
                  left: '0',
                  top: '0.17',
                  width: '1',
                  height: '0.48',
                },
                children: [
                  {
                    type: 'listItem',
                    itemObject: '',
                    style: {
                      left: '0',
                      top: '0',
                      width: '1',
                      height: '0.12',
                      border: {
                        style: '2',
                        color: '0xeeeeeeff',
                      },
                      borderWidth: '1',
                    },
                    children: [
                      {
                        type: 'label',
                        dataKey: 'itemObject.name.firstName',
                        style: {
                          left: '0.08',
                          top: '0.025',
                          width: '0.15',
                          height: '0.07',
                          fontSize: '32',
                          fontStyle: 'bold',
                          color: '0xffffffff',
                          backgroundColor: '0xff8f90ff',
                          display: 'inline',
                          textAlign: {
                            x: 'center',
                            y: 'center',
                          },
                        },
                      },
                      {
                        type: 'label',
                        dataKey: 'itemObject.name.lastName',
                        style: {
                          left: '0.3',
                          top: '0.045',
                          width: '0.7',
                          height: '0.03',
                          fontSize: '18',
                          color: '0x000000ff',
                        },
                      },
                      {
                        type: 'button',
                        onClick: [
                          {
                            actionType: 'updateObject',
                            dataKey: 'MeetingLobby.inviteesInfo.edge',
                            dataObject: 'itemObject',
                          },
                          {
                            actionType: 'evalObject',
                            object: {
                              '.MeetingLobby.inviteesInfo.edge.tage@': 1,
                            },
                          },
                          {
                            actionType: 'evalObject',
                            object: [
                              {
                                '=.MeetingLobby.inviteesInfo.edgeAPI.store': '',
                              },
                            ],
                          },
                          {
                            actionType: 'refresh',
                          },
                        ],
                        text: 'Delete',
                        style: {
                          left: '0.8',
                          top: '0.037',
                          width: '0.15',
                          height: '0.04',
                          fontSize: '14',
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
              {
                type: 'button',
                onClick: [
                  {
                    actionType: 'updateObject',
                    dataKey: 'Global.rootRoomInfo.edge.name.roomName',
                    dataObject: '..rootRoom.edge.name.roomName',
                  },
                  {
                    actionType: 'saveObject',
                    object: '..save',
                  },
                  {
                    actionType: 'evalObject',
                    object: {
                      '.Global.VideoChatObjStore.reference.edge@':
                        '=..rootRoom.edge.edge',
                    },
                  },
                  {
                    actionType: 'evalObject',
                    object: {
                      '.Global.VideoChatObjStore.reference.edge.refid@':
                        '=.Global.rootRoomInfo.edge.id',
                    },
                  },
                  {
                    goto: 'VideoChat',
                  },
                ],
                text: 'Enter Meeting Room',
                style: {
                  left: '0.2',
                  top: '0.56',
                  width: '0.6',
                  height: '0.05',
                  fontSize: '18',
                  color: '0xffffffff',
                  fontWeight: 500,
                  backgroundColor: '0x388eccff',
                  borderRaduis: '3',
                  textAlign: {
                    x: 'center',
                  },
                  border: {
                    style: '1',
                  },
                  borderRadius: '3',
                },
              },
              {
                type: 'button',
                text: 'Close Meeting Room',
                style: {
                  left: '0.2',
                  top: '0.63',
                  width: '0.6',
                  height: '0.05',
                  fontSize: '18',
                  fontWeight: 500,
                  borderRaduis: '3',
                  color: '0xffffffff',
                  backgroundColor: '0xd53d42ff',
                  textAlign: {
                    x: 'center',
                  },
                  border: {
                    style: '1',
                  },
                },
                onClick: [
                  {
                    actionType: 'evalObject',
                    object: {
                      '..rootRoom.edge.tage@': -1,
                    },
                  },
                  {
                    actionType: 'saveObject',
                    object: '..save',
                  },
                  {
                    goto: 'MeetingRoomHistory',
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
