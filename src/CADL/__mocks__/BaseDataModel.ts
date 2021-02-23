export default {
  AppName: 'AiTChat',
  VoidObj: 'vVoOiIdD',
  EmptyObj: '',
  EcosObj: {
    id: '',
    name: '',
    type: '0',
    ctime: '0',
  },
  Vertex: {
    '.EcosObj': '',
    uid: '',
    pk: '',
    esk: '',
    deat: '',
  },
  VertexAPI: {
    get: {
      api: 'rv',
    },
    store: {
      api: 'cv',
    },
  },
  Edge: {
    '.EcosObj': '',
    subtype: '',
    bvid: '',
    evid: '',
    ctime: '',
    tage: '',
  },
  EdgeAPI: {
    get: {
      api: 're',
      xfname: 'bvid',
      maxcount: '1',
    },
    store: {
      api: 'ce',
    },
  },
  Document: {
    '.EcosObj': '',
    eid: '',
    fid: '',
  },
  DocAPI: {
    get: {
      api: 'rd',
      ids: '',
      xfname: '',
      type: '0',
      maxcount: '1',
    },
    store: {
      api: 'cd',
      type: {
        isOnServer: 'auto',
        isZipped: 'auto',
        isBinary: '0',
        isEncryped: '0',
        isExtraKeyNeeded: '0',
        isEditable: '0',
        applicationDataType: '0',
        mediaType: '0',
        size: 'auto',
      },
    },
  },
  Message: {
    avatar: 'https://public.aitmed.com/avatar/JohnDoe.jpg',
    to: '',
    from: '.Global.currentUser.name.firstName',
    createDate: '',
    createTime: '',
    subject: 'A Subject',
    content: 'The message',
    applicationLink: '',
  },
  Const: {
    w9: '101',
    workComp: '102',
  },
  DataCache: {
    loadingDateTime: '0',
    expireTime: '24hr',
  },
  Global: {
    globalRegister: [
      {
        type: 'register',
        onEvent: 'FCMOnTokenReceive',
        emit: {
          dataKey: { var: 'onEvent' },
          actions: [
            {
              '=.builtIn.FCM.getFCMToken': {
                dataIn: {
                  token: '$var',
                },
                dataOut: 'FirebaseToken.edge.name.accessToken',
              },
            },
            {
              '=.builtIn.FCM.getAPPID': {
                dataIn: {
                  appName: '=.AppName',
                },
                dataOut: 'FirebaseToken.edge.evid',
              },
            },
            {
              '=.builtIn.FCM.getFCMTokenSHA256Half': {
                dataIn: {
                  token: '$var',
                },
                dataOut: 'FirebaseToken.edge.refid',
              },
            },
            '=.FirebaseToken.edgeAPI.store',
          ],
        },
      },
      {
        type: 'register',
        onEvent: 'FCMOnTokenRefresh',
        emit: {
          dataKey: { var: 'onEvent' },
          actions: [
            {
              '=.builtIn.FCM.getFCMToken': {
                dataIn: {
                  token: '$var',
                },
                dataOut: 'FirebaseToken.edge.name.accessToken',
              },
            },
            {
              '=.builtIn.FCM.getAPPID': {
                dataIn: {
                  appName: '=.AppName',
                },
                dataOut: 'FirebaseToken.edge.evid',
              },
            },
            {
              '=.builtIn.FCM.getFCMTokenSHA256Half': {
                dataIn: {
                  token: '$var',
                },
                dataOut: 'FirebaseToken.edge.refid',
              },
            },
            '=.FirebaseToken.edgeAPI.store',
          ],
        },
      },
    ],
    currentDateTime: '.builtIn.currentDateTime',
    currentUser: {
      dataCache: {
        '.DataCache': '',
        expireTime: '2hr',
      },
      vertex: {
        '.Vertex': '',
        name: {
          userName: 'username',
          avatar: '',
        },
      },
      JWT: '',
    },
    contactList: {
      dataCache: {
        '.DataCache': '',
        expireTime: '2hr',
      },
      contacts: [
        {
          '.Edge': {
            name: {
              aitmedId: '1234567',
              userName: 'Sang Rose Lee',
              phone: '(714)123-4212',
              notes: 'Been in the provider for 10 yrs',
            },
          },
        },
      ],
      get: {
        '.EdgeAPI.get': '',
        dataKey: 'Global.contactList.contacts',
        id: '.Global.currentUser.vertex.id',
        type: '10002',
        xfname: 'bvid',
      },
    },
    rootNotebook: {
      edge: {
        '.Edge': '',
        type: '10000',
        bvid: '.Global.currentUser.vertex.id',
      },
      edgeAPI: {
        '.EdgeAPI': '',
        get: {
          type: '10000',
          xfname: 'bvid',
          dataKey: 'Global.rootNotebook.edge',
        },
        store: {
          dataKey: 'Global.rootNotebook.edge',
        },
      },
    },
    actingUser: {
      DataCache: {
        expireTime: '2hr',
      },
      vertex: '.Vertex',
    },
    rootRoomInfo: {
      edge: {
        '.Edge': '',
        type: 40000,
        bvid: '.Global.currentUser.vertex.id',
        name: {
          roomName: 'Test Room 1',
          videoProvider: 'twilio',
        },
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataKey: 'Global.rootRoomInfo.edge',
        },
      },
    },
    VideoChatObjStore: {
      reference: {
        edge: '',
      },
    },
  },
  Credential: {
    patientUser: {
      vertex: {
        '.Vertex': '',
        type: 'patient',
      },
    },
  },
}
