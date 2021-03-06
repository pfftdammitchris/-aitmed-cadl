export default {
  MeetingRoomCreate: {
    module: 'meetingroom',
    pageNumber: '90',
    title: 'Meeting Rooms',
    init: [
      '.SignInCheck',
      {
        actionType: 'evalObject',
        object: {
          '=.builtIn.string.concat': {
            dataIn: [
              ' =..calendarDate.year',
              '-',
              '=..calendarDate.month',
              '-',
              '=..calendarDate.day',
            ],
            dataOut: 'MeetingRoomCreate.listData.hostroom.sCondition',
          },
        },
      },
      '..listData.get',
      {
        if: [
          '..listData.hostroom.edge.0',
          'continue',
          {
            '=.builtIn.checkField': {
              dataIn: {
                contentType: 'messageHidden',
                wait: 100,
              },
            },
          },
        ],
      },
    ],
    save: ['..newRoomInfo.edgeAPI.store'],
    lastTop: '0.0',
    listData: {
      hostroom: {
        id: '.Global.currentUser.vertex.id',
        type: '40000',
        xfname: 'bvid',
        sCondition: 'refid IS NULL AND tage=0 AND ctime>UNIX_TIMESTAMP()-86400',
        maxcount: '20',
        obfname: 'mtime',
        _nonce: '=.Global._nonce',
      },
      get: {
        '.EdgeAPI.get': '',
        api: 're',
        dataKey: 'listData.hostroom',
        id: '.Global.currentUser.vertex.id',
        type: '40000',
        xfname: 'bvid',
        sCondition: 'refid IS NULL AND tage=0 AND ctime>UNIX_TIMESTAMP()-86400',
        maxcount: '20',
        obfname: 'mtime',
        _nonce: '=.Global._nonce',
      },
    },
    newRoomInfo: {
      edge: {
        '.Edge': '',
        id: '',
        type: 40000,
        bvid: '.Global.currentUser.vertex.id',
        name: {
          roomName: 'New Room',
          videoProvider: '.Global.currentUser.vertex.name.userName',
        },
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataIn: 'newRoomInfo.edge',
          dataOut: 'createdRoomInfo.edge',
        },
      },
    },
    createdRoomInfo: {
      edge: {
        '.Edge': '',
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
          position: 'fixed',
        },
        children: [
          {
            '.MenuHeader': null,
          },
          {
            '.SubMenuView': null,
            children: [
              {
                '.SubMenuButton': null,
              },
              {
                '.SubMenuButton': null,
                text: 'Create',
                style: {
                  left: '0.34',
                  color: '0xffffffff',
                },
                onClick: [
                  {
                    goto: 'MeetingRoomCreate',
                  },
                ],
              },
              {
                '.SubMenuButton': null,
                text: 'History',
                style: {
                  left: '0.67',
                },
                onClick: [
                  {
                    goto: 'MeetingRoomHistory',
                  },
                ],
              },
            ],
          },
          {
            type: 'label',
            contentType: 'messageHidden',
            text: 'No meetings created',
            style: {
              left: '0.31',
              top: '0.25',
              width: '0.72',
              height: '0.04',
              color: '0x000058',
              fontSize: '16',
              isHidden: 'true',
            },
          },
          {
            type: 'list',
            contentType: 'listObject',
            listObject: '..listData.hostroom.edge',
            iteratorVar: 'itemObject',
            style: {
              left: '0',
              top: '0.2',
              width: '1',
              height: '0.8',
            },
            children: [
              {
                type: 'listItem',
                itemObject: '',
                onClick: [
                  {
                    actionType: 'updateObject',
                    dataKey: 'Global.rootRoomInfo.edge',
                    dataObject: 'itemObject',
                  },
                  {
                    goto: 'MeetingLobby',
                  },
                ],
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
                    dataKey: 'itemObject.name.roomName',
                    style: {
                      left: '0.08',
                      top: '0.01',
                      width: '0.8',
                      height: '0.04',
                      fontSize: '16',
                      fontWeight: 400,
                      color: '0x000000',
                      display: 'inline',
                      textAlign: {
                        x: 'left',
                        y: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'itemObject.name.videoProvider',
                    style: {
                      left: '0.08',
                      top: '0.08',
                      width: '0.9',
                      fontWeight: 400,
                      height: '0.03',
                      fontSize: '16',
                      color: '0x00000058',
                    },
                  },
                  {
                    type: 'image',
                    path: 'rightArrow.png',
                    style: {
                      left: '0.88',
                      top: '0.02',
                      width: '0.08',
                      height: '0.04',
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'image',
            zIndex: 1,
            path: 'addMeeting.png',
            onClick: [
              {
                actionType: 'popUp',
                popUpView: 'confirmView',
              },
            ],
            style: {
              left: '0.8',
              top: '0.82',
              width: '0.13',
              backgroundColor: '0x388eccff',
              border: {
                style: '5',
              },
              borderRadius: '100',
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
                  width: '0.88',
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
                    text: 'Create Room Name',
                    style: {
                      '.LabelStyle': {
                        left: '0',
                        top: '0.04',
                        width: '0.88',
                        height: '0.05',
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
                    type: 'textField',
                    contentType: 'text',
                    placeholder: 'Please type the title here',
                    dataKey: 'newRoomInfo.edge.name.roomName',
                    style: {
                      '.LabelStyle': {
                        left: '0.085',
                        top: '0.13',
                        width: '0.7',
                        height: '0.05',
                        color: '0x00000088',
                        fontSize: '20',
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
                        width: '0.88',
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
                        actionType: 'saveObject',
                        object: '..save',
                      },
                      {
                        actionType: 'evalObject',
                        object: {
                          '.Global._nonce@': {
                            '=.builtIn.math.random': '',
                          },
                          '.Global.rootRoomInfo.edge@':
                            '=..createdRoomInfo.edge.edge',
                        },
                      },
                      {
                        actionType: 'popUpDismiss',
                        popUpView: 'confirmView',
                      },
                      {
                        goto: 'MeetingLobby',
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
    ],
  },
}
