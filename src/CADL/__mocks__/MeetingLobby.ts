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
      edge: {
        '.Edge': '',
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataKey: 'inviteesInfo.edge',
        },
      },
    },
    shareDocuments: {
      document: {
        '.UploadDocuments.shareDocument.document': '',
        eid: '.Global.rootRoomInfo.edge.id',
        type: {
          applicationDataType: '.Const.share',
        },
      },
      docAPI: {
        '.DocAPI': '',
        store: {
          dataKey: 'shareDocuments.document',
          api: 'cd',
          type: {
            mediaType: '',
          },
          condition: {
            isPlain: 'text/plain',
            isJpeg: 'image/jpeg',
            isPng: 'image/png',
          },
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
          '.MeetingLobby.rootRoom.edge@': '=.Global.rootRoomInfo.edge',
        },
      },
      '..listData.get',
    ],
    save: [
      '..rootRoom.edgeAPI.store',
      {
        if: [
          '=.UploadDocuments.shareDocument.document.id',
          '=..shareDocument.docAPI.store',
          'continue',
        ],
      },
    ],
    update: ['..inviteesInfo.edgeAPI.store', '..listData.get'],
    listData: {
      response: {
        edge: [
          {
            '.Edge': {
              name: {
                firstName: 'test',
                lastName: '1',
              },
            },
          },
          {
            '.Edge': {
              name: {
                firstName: 'test',
                lastName: '2',
              },
            },
          },
        ],
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
                  height: '0.041',
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
            ],
          },
          {
            type: 'view',
            style: {
              top: '0.28',
              left: '0',
              height: '0.2',
              width: '0.2',
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
                        goto: 'UploadDocuments',
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
                children: [
                  {
                    type: 'label',
                    text: 1,
                    dataKey: null,
                    style: {
                      width: '0.18',
                      color: '0xeb3d38',
                      fontSize: '16',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                  {
                    type: 'label',
                    text: 'Document(s) have been uploaded.',
                    dataKey: null,
                    style: {
                      width: '0.8',
                      left: '0.19',
                      color: '0x000000',
                      fontSize: '16',
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
                              '..inviteesInfo.edge.tage@': -1,
                            },
                          },
                          {
                            actionType: 'saveObject',
                            object: '..update',
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
                    goto: 'VideoChat',
                  },
                ],
                text: 'Enter Meeting Room',
                style: {
                  left: '0.2',
                  top: '0.8',
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
                  top: '0.9',
                  width: '0.6',
                  height: '0.07',
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
