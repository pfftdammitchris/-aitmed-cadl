export default {
  VideoChat: {
    pageNumber: '190',
    init: [
      '.SignInCheck',
      {
        actionType: 'evalObject',
        object: {
          '..rootRoomInfo.edge.tage@': 0,
        },
      },
      '..save',
      {
        actionType: 'evalObject',
        object: {
          '.Global.timer@': '=.Global.rootRoomInfo.edge.name.duration',
        },
      },
      {
        actionType: 'evalObject',
        object: {
          '.Global.rootRoomInfo.edge@': '=..roomInfo.response.edge',
        },
      },
      {
        actionType: 'builtIn',
        funcName: 'videoChat',
        roomId: '..roomInfo.response.edge.deat.roomID',
        accessToken: '..roomInfo.response.edge.deat.accessToken',
        timerTag: 'videoTimer',
        timer: '.Global.timer',
      },
    ],
    cameraOn: 'true',
    micOn: 'true',
    miuAutoMicOffTimespan: '3',
    miuAutoMicOffThresdhold: '3',
    emptyId: '',
    save: ['..roomInfo.edgeAPI.store'],
    roomInfo: {
      response: '',
      edge: {
        '.Global.VideoChatObjStore.reference.edge': '',
        id: '..emptyId',
        bvid: '.Global.currentUser.vertex.id',
        evid: '..emptyId',
        name: '.Global.VideoChatObjStore.reference.edge.name',
        refid: '.Global.VideoChatObjStore.reference.edge.id',
        type: 40000,
        _nonce: '=.Global._nonce',
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataIn: 'roomInfo.edge',
          dataOut: 'roomInfo.response',
        },
      },
    },
    listData: {
      participants: [
        {
          '.Edge': null,
        },
      ],
      get: {
        '.EdgeAPI.get': '',
        api: 're',
        dataKey: 'listData.participants',
        id: '.MeetingLobbyStart.rootRoom.edge.id',
        type: '40000',
        xfname: 'refid',
        sCondition: 'tage=0 AND ctime>UNIX_TIMESTAMP()-86400',
        maxcount: '20',
      },
    },
    popUpList: [
      {
        text: 'Meeting Lobby',
        pageName: 'ManageMeeting',
      },
      {
        text: 'Shared Documents',
        pageName: 'MeetingDocumentsShared',
      },
      {
        text: 'Meeting Notes',
        pageName: 'MeetingDocumentsNotes',
      },
      {
        text: 'Share your screen',
        pageName: 'ScreenShare',
      },
    ],
    popUpListTemp: '',
    components: [
      {
        '.BaseCheckView': '',
        message: 'Under construction...',
        viewTag: 'underconstruction',
      },
      {
        type: 'register',
        onEvent: 'twilioOnPeopleJoin',
        actions: [
          {
            actionType: 'builtIn',
            funcName: 'hide',
            viewTag: 'waitForOtherTag',
          },
        ],
      },
      {
        type: 'register',
        onEvent: 'twilioOnNoParticipant',
        actions: [
          {
            actionType: 'builtIn',
            funcName: 'show',
            viewTag: 'waitForOtherTag',
          },
        ],
      },
      {
        type: 'view',
        style: {
          left: '0',
          top: '0',
          width: '1',
          height: '1',
          backgroundColor: '0x400000',
        },
        children: [
          {
            type: 'image',
            path: 'waitingroom.png',
            style: {
              left: '0',
              top: '0',
              width: '1',
              height: '1',
            },
          },
          {
            type: 'view',
            viewTag: 'mainStream',
            style: {
              left: '0',
              top: '0',
              width: '1',
              height: '1',
              backgroundColor: '0x00000000',
            },
          },
          {
            type: 'view',
            viewTag: 'selfStream',
            style: {
              left: '0.04',
              top: '0.1',
              width: '0.2',
              height: '0.15',
              backgroundColor: '0x00000000',
            },
          },
          {
            type: 'view',
            style: {
              left: '0',
              top: '0',
              width: '1',
              height: '0.07',
              backgroundColor: '0x000000',
            },
            children: [
              {
                type: 'label',
                dataKey: 'roomInfo.edge.name.roomName',
                style: {
                  left: '0',
                  top: '0',
                  width: '1',
                  height: '55px',
                  lineHeight: '55px',
                  fontSize: '20',
                  fontStyle: 'bold',
                  color: '0xFFFFFF',
                  textAlign: {
                    x: 'center',
                  },
                },
              },
              {
                type: 'label',
                text: 'Switch Camera',
                style: {
                  left: '0.77',
                  top: '0',
                  width: '0.2',
                  height: '55px',
                  lineHeight: '55px',
                  fontSize: '14',
                  color: '0xFFFFFF',
                  textAlign: {
                    x: 'right',
                  },
                },
                onClick: {
                  actionType: 'builtIn',
                  funcName: 'switchCamera',
                },
              },
            ],
          },
          {
            type: 'image',
            path: 'logo.png',
            viewTag: 'waitForOtherTag',
            style: {
              left: '0.4',
              top: '0.15',
              width: '0.2',
              border: {
                style: '5',
              },
            },
            borderRadius: 32,
          },
          {
            type: 'label',
            contentType: 'hidden',
            viewTag: 'waitForOtherTag',
            text: 'Waiting for others to join',
            style: {
              left: '0',
              top: '0.3',
              width: '1',
              height: '0.04',
              fontSize: '16',
              fontStyle: 'bold',
              color: '0x000000',
              textAlign: {
                x: 'center',
              },
            },
          },
          {
            type: 'list',
            contentType: 'videoSubStream',
            listObject: '',
            iteratorVar: 'itemObject',
            style: {
              axis: 'horizontal',
              left: '0.04',
              top: '0.62',
              width: '0.92',
              height: '0.15',
            },
            children: [
              {
                type: 'listItem',
                itemObject: '',
                style: {
                  left: '0',
                  top: '0',
                  width: '0.18',
                  height: '0.15',
                  border: {
                    style: '1',
                  },
                },
                children: [
                  {
                    type: 'view',
                    viewTag: 'subStream',
                    style: {
                      left: '0.015',
                      top: '0',
                      width: '0.15',
                      height: '0.15',
                      border: {
                        style: '5',
                      },
                      borderRadius: '5',
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'view',
            style: {
              left: '0',
              top: '0.9',
              width: '1',
              height: '0.1',
              border: {
                style: '5',
              },
              backgroundColor: '0x000000',
              position: 'fixed',
            },
            children: [
              {
                type: 'image',
                viewTag: 'camera',
                path: {
                  emit: {
                    actions: [
                      {
                        if: [
                          '=.VideoChat.cameraOn',
                          'https://public.aitmed.com/commonRes/cameraOn.png',
                          'https://public.aitmed.com/commonRes/cameraOff.png',
                        ],
                      },
                    ],
                  },
                },
                onClick: [
                  {
                    emit: {
                      actions: [
                        {
                          if: [
                            '=.VideoChat.cameraOn',
                            {
                              '.VideoChat.cameraOn@': false,
                            },
                            {
                              '.VideoChat.cameraOn@': true,
                            },
                          ],
                        },
                      ],
                    },
                  },
                  {
                    actionType: 'builtIn',
                    funcName: 'redraw',
                    viewTag: 'camera',
                  },
                  {
                    actionType: 'builtIn',
                    funcName: 'toggleFlag',
                    dataKey: 'VideoChat.cameraOn',
                  },
                ],
                style: {
                  left: '0.067',
                  top: '0.03',
                  width: '0.12',
                  height: '0.035',
                },
              },
              {
                type: 'image',
                viewTag: 'microphone',
                path: {
                  emit: {
                    actions: [
                      {
                        if: [
                          '=.VideoChat.micOn',
                          'https://public.aitmed.com/commonRes/micOn.png',
                          'https://public.aitmed.com/commonRes/micOff.png',
                        ],
                      },
                    ],
                  },
                },
                onClick: [
                  {
                    emit: {
                      actions: [
                        {
                          if: [
                            '=.VideoChat.micOn',
                            {
                              '.VideoChat.micOn@': false,
                            },
                            {
                              '.VideoChat.micOn@': true,
                            },
                          ],
                        },
                      ],
                    },
                  },
                  {
                    actionType: 'builtIn',
                    funcName: 'redraw',
                    viewTag: 'microphone',
                  },
                  {
                    actionType: 'builtIn',
                    funcName: 'toggleFlag',
                    dataKey: 'VideoChat.micOn',
                  },
                ],
                style: {
                  left: '0.254',
                  top: '0.022',
                  width: '0.12',
                  height: '0.05',
                },
              },
              {
                type: 'image',
                path: 'hangUp.png',
                onClick: [
                  {
                    actionType: 'popUp',
                    popUpView: 'confirmView',
                  },
                ],
                style: {
                  left: '0.44',
                  top: '0.0185',
                  width: '0.12',
                  backgroundColor: '0xd81e06',
                  border: {
                    style: '3',
                    width: '1',
                  },
                  borderRadius: '100',
                },
              },
              {
                type: 'view',
                style: {
                  width: '0.13',
                  height: '0.1',
                  left: '0.628',
                  top: '0',
                },
                onClick: [
                  {
                    actionType: 'popUp',
                    popUpView: 'selectView',
                    dismissOnTouchOutside: true,
                  },
                ],
                children: [
                  {
                    type: 'image',
                    path: 'NavIcMore.png',
                    style: {
                      left: '0',
                      top: '0.032',
                      width: '0.13',
                    },
                  },
                ],
              },
              {
                type: 'label',
                contentType: 'timer',
                viewTag: 'videoTimer',
                'text=func': '=.builtIn.string.formatTimer',
                dataKey: 'Global.timer',
                style: {
                  left: '0.815',
                  top: '0.032',
                  height: '0.04',
                  width: '0.11',
                  fontSize: '14',
                  color: '0xffffff',
                  fontWeight: '500',
                },
              },
            ],
          },
        ],
      },
      {
        type: 'popUp',
        viewTag: 'minimizeVideoChat',
        global: true,
        style: {
          left: '0',
          top: '0',
          width: '0.1',
          height: '0.1',
        },
        image: 'iconUrl',
        onClick: [
          {
            actionType: 'builtIn',
            funcName: 'goBack',
            reload: false,
          },
          {
            actionType: 'popUpDismiss',
            popUpView: 'minimizeVidwoChat',
          },
        ],
      },
      {
        type: 'popUp',
        viewTag: 'confirmView',
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
              left: '0.1',
              top: '0.325',
              width: '0.8',
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
                text: 'LEAVING MEETING...',
                style: {
                  '.LabelStyle': {
                    left: '0.05',
                    top: '0.02',
                    width: '0.7',
                    height: '0.04',
                    color: '0x00000088',
                    fontSize: '20',
                    fontWeight: '500',
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
                text: 'Close this meeting room?',
                style: {
                  '.LabelStyle': {
                    left: '0.05',
                    top: '0.06',
                    width: '0.7',
                    height: '0.04',
                    color: '0x00000088',
                    fontSize: '20',
                    fontWeight: '500',
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
                text:
                  'Closing the room will generate a Summary for each participant.',
                style: {
                  '.LabelStyle': {
                    left: '0.05',
                    top: '0.11',
                    width: '0.7',
                    height: '0.04',
                    color: '0x00000088',
                    fontSize: '16',
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
                text:
                  'If you desire to return to this meeting, keep this room open',
                style: {
                  '.LabelStyle': {
                    left: '0.05',
                    top: '0.18',
                    width: '0.7',
                    height: '0.04',
                    color: '0x00000088',
                    fontSize: '16',
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
                    width: '0.8',
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
                  {
                    actionType: 'evalObject',
                    object: {
                      '..roomInfo.edge.id@': '=..roomInfo.response.edge.id',
                    },
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        '..roomInfo.edge.tage@': 1,
                      },
                      {
                        '..roomInfo.edge.name.duration@': '=.Global.timer',
                      },
                    ],
                  },
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
                    },
                  },
                  {
                    actionType: 'popUp',
                    popUpView: 'minimizeVideoChat',
                  },
                  {
                    goto: {
                      dataIn: {
                        destination: 'MeetingRoomHistory',
                        keepLive: true,
                      },
                    },
                  },
                ],
                text: 'Keep Open',
                style: {
                  '.LabelStyle': {
                    left: '0',
                    top: '0.275',
                    width: '0.4',
                    height: '0.06812',
                    color: '0x388eccff',
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
                      '..roomInfo.edge.id@': '=..roomInfo.response.edge.id',
                    },
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        '..roomInfo.edge.tage@': -1,
                      },
                      {
                        '..roomInfo.edge.subtype@': 1,
                      },
                      {
                        '..roomInfo.edge.name.duration@': '=.Global.timer',
                      },
                    ],
                  },
                  {
                    actionType: 'saveObject',
                    object: '..save',
                  },
                  {
                    actionType: 'evalObject',
                    object: {
                      '.Global.rootRoomInfo.edge@': '=..roomInfo.response.edge',
                    },
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
                    goto: 'MeetingSummary',
                  },
                ],
                text: 'Close Meeting',
                style: {
                  '.LabelStyle': {
                    left: '0.4',
                    top: '0.275',
                    width: '0.4',
                    height: '0.06812',
                    color: '0x388eccff',
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
                    left: '0.4',
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
      {
        type: 'popUp',
        viewTag: 'selectView',
        style: {
          left: '0.5',
          width: '0.45',
          height: '0.2',
          top: '0.71',
          backgroundColor: '0xf4f4f4',
          border: {
            style: '3',
          },
          borderColor: '0x000000',
          borderWidth: '1.5',
          borderRadius: '10',
        },
        children: [
          {
            type: 'list',
            contentType: 'listObject',
            listObject: '..popUpList',
            iteratorVar: 'itemObject',
            style: {
              marginTop: '0',
              width: '0.45',
              height: '0.198',
              top: '0',
              left: '0',
            },
            children: [
              {
                type: 'listItem',
                itemObject: '',
                onClick: [
                  {
                    actionType: 'updateObject',
                    dataKey: 'VideoChat.popUpListTemp',
                    dataObject: 'itemObject',
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        if: [
                          {
                            '=.builtIn.string.equal': {
                              dataIn: {
                                string1: '=.VideoChat.popUpListTemp.pageName',
                                string2: 'ScreenShare',
                              },
                            },
                          },
                          {
                            actionType: 'builtIn',
                            funcName: 'screenShare',
                          },
                          {
                            goto: '.VideoChat.popUpListTemp.pageName',
                          },
                        ],
                      },
                    ],
                  },
                ],
                style: {
                  width: '0.45',
                  height: '0.049',
                  border: {
                    style: '2',
                  },
                  borderColor: '0x00000066',
                  borderWidth: '0.1',
                },
                children: [
                  {
                    type: 'label',
                    dataKey: 'itemObject.text',
                    style: {
                      width: '0.45',
                      height: '0.03',
                      top: '0.011',
                      fontWeight: '500',
                      textAlign: {
                        x: 'center',
                      },
                      fontSize: '14',
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
