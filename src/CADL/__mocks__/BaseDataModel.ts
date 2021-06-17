export default {
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
    subtype: {
      isOnServer: '1',
      isZipped: 'auto',
      isBinary: '0',
      isEncryped: '0',
      isExtraKeyNeeded: '0',
      isEditable: '0',
      isCached: '1',
      applicationDataType: '0',
      mediaType: '0',
      size: 'auto',
    },
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
    },
  },
  Message: {
    avatar: 'https://public.aitmed.com/avatar/JohnDoe.jpg',
    to: '',
    from: '=.Global.currentUser.name.firstName',
    createDate: '',
    createTime: '',
    subject: 'A Subject',
    content: 'The message',
    applicationLink: '',
  },
  Const: {
    profile: '1',
    w9: '101',
    workComp: '102',
    share: '103',
    contact: '104',
  },
  ErrorMessage: '',
  DataCache: {
    loadingDateTime: '0',
    expireTime: '24hr',
  },
  Global: {
    ecosDocObj: '',
    globalRegister: [
      {
        type: 'register',
        onEvent: 'FCMOnTokenReceive',
        emit: {
          dataKey: {
            var: 'onEvent',
          },
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
        onEvent: 'onNewEcosDoc',
        emit: {
          dataKey: {
            var: 'did',
          },
          actions: [
            {
              '=.builtIn.ecos.getDoc': {
                dataIn: {
                  docId: '$var',
                },
                dataOut: 'Global.ecosDocObj',
              },
            },
            {
              if: [
                {
                  '=.builtIn.utils.isOnPage': {
                    dataIn: 'MeetingChat',
                  },
                },
                '=.MeetingChat.onNewMessageToDisplay',
                'continue',
              ],
            },
          ],
        },
      },
    ],
    newAccountFlag: '1',
    currentDateTime: '=.builtIn.currentDateTime',
    currentUser: {
      response: null,
      dataCache: {
        '.DataCache': '',
        expireTime: '2hr',
      },
      vertex: {
        '.Vertex': '',
        name: {
          userName: '',
          firstName: '',
          lastName: '',
          fullName: '',
        },
      },
      vertexAPI: {
        '.VertexAPI': '',
        store: {
          api: 'cv',
          dataIn: 'Global.currentUser.vertex',
          dataOut: 'Global.currentUser.response',
        },
      },
      JWT: '',
    },
    rootNotebookID: '',
    actingUser: {
      DataCache: {
        expireTime: '2hr',
      },
      vertex: '.Vertex',
    },
    rootRoomInfo: {
      response: '',
      edge: {
        '.Edge': '',
        type: 40000,
        bvid: '.Global.currentUser.vertex.id',
        name: {
          title: 'New room',
          videoProvider: '.Global.currentUser.vertex.name.userName',
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
    profile: {
      document: '',
    },
    contact: {
      document: {
        name: {
          data: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
          },
        },
      },
    },
    phoneNumber: '',
    _nonce: 0,
    VideoChatObjStore: {
      reference: {
        edge: '',
      },
    },
    DocReference: {
      document: '',
    },
    DocChat: {
      document: '',
    },
    DocProfile: {
      document: '',
    },
    popUpMessage: '',
    timer: 0,
    timeScondition: '',
  },
  CountryCode: ['+1', '+52', '+86', '+965'],
  DocType: {
    PubProfile: '256',
    Profile: '257',
    UploadProfile: '258',
    Contact: '513',
    ContactFav: '515',
    GetAllContact: 'type in (513,515)',
    GetAllDocument: 'D.type=1025',
    GetFavContact: 'type=515',
    UploadFile: '1025',
    InboxMessage: '1281',
    MeetingNote: '1537',
    Index: '1793',
    PatientChart: '25601',
    VitalSigns: '28161',
    VitalQuestionnaire: '30721',
    MedicalRecord: '33281',
    doctorProfile: '35841',
    businessProfile: '38401',
    covid19Questionnair: '40961',
    UserAvatar: '40960',
    UserNationalProviderNumber: '43521',
    UserLicenseNumber: '46081',
    UserDEA: '48641',
    UserSignature: '51201',
    License: '56321',
    Intake3Signature: '53761',
    F_IDCard: '58881',
    Covid19Questionnaire: '61441',
    daySchedule: '',
    annex: '66561',
    Attachment: '69121',
    F_InsuranceCard: '71681',
    B_InsuranceCard: '74241',
    Intake4Signature: '76801',
  },
  EdgeType: {
    ContactSupport: '2020',
    'pa:Feedback': '20100',
    Feedback: '1090',
    WaitingRoom: '40000',
    InviteInfo: '1053',
    doctorAndPatientEdge: '10140',
    InviteInbox: '1050',
    Accept: '1060',
    Email: '10002',
    Folder: '66560',
    GetMyEdge: 'E.type>9999 AND E.type<40001',
  },
  VertexType: {
    User: '1',
  },
}
