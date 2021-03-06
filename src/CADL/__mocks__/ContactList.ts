export default {
  ContactsList: {
    pageNumber: '340',
    title: 'My Directory',
    init: [
      '.SignInCheck',
      '..listData.get',
      {
        if: [
          '=..listData.contactList.doc.0',
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
    searchInput: '',
    save: [
      {
        '=.ContactsList.contactInfo.docAPI.store': '',
      },
    ],
    searchData: {
      searchContact: '',
    },
    inviteMeeting: {
      edge: {
        '.Edge': '',
        type: 1053,
        refid: '',
        bvid: '.Global.currentUser.vertex.id',
        name: {
          phoneNumber: '',
          firstName: '',
          lastName: '',
          hostName: '.Global.currentUser.vertex.name.userName',
          title: '',
          fullName: '',
        },
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataIn: 'inviteMeeting.edge',
        },
      },
    },
    listData: {
      contactList: {
        doc: {
          name: {
            data: {
              firstName: 'Test',
              isFavorite: false,
            },
          },
        },
      },
      get: {
        '.DocAPI.get': '',
        api: 'rd',
        dataKey: 'listData.contactList',
        ids: ['.Global.rootNotebookID'],
        xfname: 'eid',
        maxcount: '500',
        obfname: 'mtime',
        sCondition: '.DocType.GetAllContact',
        _nonce: '=.Global._nonce',
      },
    },
    listReData: {
      contactList: {
        doc: {
          id: '.Global.rootNotebookID',
          xfname: 'eid',
          maxcount: '500',
          obfname: 'mtime',
          sCondition: '.DocType.GetAllContact',
          ObjType: 3,
          key: '=..searchInput',
          _nonce: '=.Global._nonce',
        },
      },
      get: {
        api: 'rd',
        dataIn: 'listReData.contactList.doc',
        dataOut: 'ContactsList.listData.contactList',
        '.DocAPI.get': '',
      },
    },
    contactInfo: {
      document: {
        _nonce: '=.Global._nonce',
      },
      docAPI: {
        '.DocAPI': '',
        store: {
          api: 'cd',
          dataKey: 'ContactsList.contactInfo.document',
        },
      },
    },
    generalInfo: {
      value: true,
    },
    newRoomInfo: {
      edge: {
        '.Edge': '',
        id: '',
        type: 40000,
        bvid: '.Global.currentUser.vertex.id',
        name: {
          title: 'New Room',
          videoProvider: '.Global.currentUser.vertex.name.userName',
          fullName: '.Global.currentUser.vertex.name.fullName',
          hostName: '.Global.currentUser.vertex.name.fullName',
          duration: 0,
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
          top: '0',
          left: '0',
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
            '.HeaderRightImg': null,
            path: 'sideNav2.png',
            onClick: [
              {
                goto: 'SideMenuBar',
              },
            ],
          },
          {
            '.SubMenuView': null,
            style: {
              top: '0.09',
              backgroundColor: '0x388ecc',
              height: '0.1',
              zIndex: '10',
            },
            children: [
              {
                '.SubMenuButton': null,
                text: 'Favorites',
                style: {
                  top: '0.03',
                },
                onClick: [
                  {
                    goto: 'FavoriteList',
                  },
                ],
              },
              {
                '.SubMenuButton': null,
                text: 'Recents',
                style: {
                  top: '0.03',
                  left: '0.33',
                },
                onClick: [
                  {
                    goto: 'RecentList',
                  },
                ],
              },
              {
                '.SubMenuButton': null,
                text: 'Contacts',
                style: {
                  top: '0.03',
                  left: '0.66',
                  color: '0xffffffff',
                },
                onClick: [
                  {
                    goto: 'ContactsList',
                  },
                ],
              },
            ],
          },
          {
            type: 'view',
            style: {
              top: '0.2',
              left: '0',
              width: '1',
              height: '0.8',
            },
            children: [
              {
                type: 'view',
                style: {
                  top: '0',
                  left: '0.04',
                  width: '1',
                  height: '0.05',
                },
                children: [
                  {
                    type: 'image',
                    path: 'add.png',
                    onClick: [
                      {
                        goto: 'AddContact',
                      },
                    ],
                    style: {
                      top: '0.012',
                      left: '0',
                      height: '0.03',
                    },
                  },
                  {
                    '.SearchField': null,
                    placeholder: 'search contacts',
                    dataKey: 'searchInput',
                    style: {
                      left: '0.1',
                      top: '0.01',
                    },
                  },
                  {
                    '.SearchDoc': null,
                    style: {
                      left: '0.75',
                      top: '0.011',
                    },
                    onClick: [
                      {
                        '.ContactsList.listData.contactList.doc@': [],
                      },
                      {
                        actionType: 'evalObject',
                        object: [
                          {
                            '.Global._nonce@': {
                              '=.builtIn.math.random': '',
                            },
                          },
                          {
                            '=..listReData.get': '',
                          },
                        ],
                      },
                      {
                        actionType: 'builtIn',
                        funcName: 'redraw',
                        viewTag: 'contactList',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'label',
                contentType: 'messageHidden',
                text: 'No contacts added',
                style: {
                  left: '0',
                  top: '0.05',
                  width: '1',
                  height: '0.04',
                  color: '0x000058',
                  fontSize: '16',
                  isHidden: 'true',
                  textAlign: {
                    x: 'center',
                  },
                },
              },
              {
                type: 'list',
                viewTag: 'contactList',
                contentType: 'listObject',
                listObject: '..listData.contactList.doc',
                iteratorVar: 'itemObject',
                style: {
                  top: '0.05',
                  left: '0.05',
                  width: '0.9',
                  height: '0.7',
                },
                children: [
                  {
                    type: 'listItem',
                    itemObject: '',
                    style: {
                      left: '0',
                      width: '0.9',
                      height: 'auto',
                      border: {
                        style: '2',
                      },
                      borderWidth: '1',
                      borderColor: '0x00000011',
                    },
                    children: [
                      {
                        type: 'image',
                        viewTag: 'select',
                        style: {
                          top: '0.03',
                          left: '0',
                          height: '0.04',
                        },
                        path: {
                          emit: {
                            dataKey: {
                              var: 'itemObject',
                            },
                            actions: [
                              {
                                if: [
                                  {
                                    '=.builtIn.string.equal': {
                                      dataIn: {
                                        string1: '=..generalInfo.value',
                                        string2: '$var.name.data.isFavorite',
                                      },
                                    },
                                  },
                                  'https://public.aitmed.com/commonRes/providerOn.png',
                                  'https://public.aitmed.com/commonRes/providerOff.png',
                                ],
                              },
                            ],
                          },
                        },
                        onClick: [
                          {
                            actionType: 'updateObject',
                            dataKey: 'ContactsList.contactInfo.document',
                            dataObject: 'itemObject',
                          },
                          {
                            emit: {
                              dataKey: {
                                var: 'itemObject',
                              },
                              actions: [
                                {
                                  if: [
                                    {
                                      '=.builtIn.string.equal': {
                                        dataIn: {
                                          string1: '=..generalInfo.value',
                                          string2: '$var.name.data.isFavorite',
                                        },
                                      },
                                    },
                                    {
                                      '=.builtIn.object.set': {
                                        dataIn: {
                                          object: '$var',
                                          key: 'name.data.isFavorite',
                                          value: false,
                                        },
                                      },
                                    },
                                    {
                                      '=.builtIn.object.set': {
                                        dataIn: {
                                          object: '$var',
                                          key: 'name.data.isFavorite',
                                          value: true,
                                        },
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            actionType: 'builtIn',
                            funcName: 'redraw',
                            viewTag: 'select',
                          },
                          {
                            actionType: 'evalObject',
                            object: [
                              {
                                if: [
                                  '=.ContactsList.contactInfo.document.name.data.isFavorite',
                                  {
                                    '.ContactsList.contactInfo.document.type@':
                                      '=.DocType.ContactFav',
                                  },
                                  {
                                    '.ContactsList.contactInfo.document.type@':
                                      '=.DocType.Contact',
                                  },
                                ],
                              },
                              {
                                '.Global._nonce@': {
                                  '=.builtIn.math.random': '',
                                },
                              },
                              {
                                '.ContactsList.contactInfo.document._nonce@': {
                                  '=.builtIn.math.random': '',
                                },
                              },
                            ],
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
                        type: 'label',
                        dataKey: 'itemObject.name.data.fullName',
                        onClick: [
                          {
                            actionType: 'updateObject',
                            dataKey: 'Global.DocReference.document',
                            dataObject: 'itemObject',
                          },
                          {
                            goto: 'ContactInformation',
                          },
                        ],
                        style: {
                          left: '0.15',
                          height: '0.1',
                          width: '0.3',
                          fontStyle: 'bold',
                          textAlign: {
                            y: 'center',
                          },
                        },
                      },
                      {
                        type: 'image',
                        path: 'callcontact.png',
                        style: {
                          left: '0.78',
                          top: '0.03',
                          height: '0.03',
                        },
                        onClick: [
                          {
                            actionType: 'updateObject',
                            dataKey: 'Global.DocReference.document',
                            dataObject: 'itemObject',
                          },
                          {
                            actionType: 'evalObject',
                            object: [
                              {
                                '..inviteMeeting.edge.name.phoneNumber@':
                                  '=.Global.DocReference.document.name.data.phoneNumber',
                              },
                              {
                                '..inviteMeeting.edge.name.firstName@':
                                  '=.Global.DocReference.document.name.data.firstName',
                              },
                              {
                                '..inviteMeeting.edge.name.lastName@':
                                  '=.Global.DocReference.document.name.data.lastName',
                              },
                              {
                                '..inviteMeeting.edge.name.fullName@':
                                  '=.Global.DocReference.document.name.data.fullName',
                              },
                            ],
                          },
                          {
                            actionType: 'evalObject',
                            object: [
                              {
                                '=.ContactsList.newRoomInfo.edgeAPI.store': '',
                              },
                              {
                                '.Global._nonce@': {
                                  '=.builtIn.math.random': '',
                                },
                              },
                              {
                                '.Global.rootRoomInfo@':
                                  '=..createdRoomInfo.edge',
                              },
                              {
                                '.Global.VideoChatObjStore.reference.edge.refid@':
                                  '=.Global.rootRoomInfo.edge.id',
                              },
                              {
                                '..inviteMeeting.edge.id@': '',
                              },
                              {
                                '..inviteMeeting.edge.refid@':
                                  '=.Global.rootRoomInfo.edge.id',
                              },
                              {
                                '..inviteMeeting.edge.name.title@':
                                  '=.Global.rootRoomInfo.edge.name.title',
                              },
                              {
                                '=.ContactsList.inviteMeeting.edgeAPI.store':
                                  '',
                              },
                            ],
                          },
                          {
                            goto: 'MeetingLobby',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'popUp',
        viewTag: 'confirmView',
        style: {
          left: '0',
          top: '0',
          width: '0.8',
          height: '1',
        },
        children: [
          {
            type: 'view',
            style: {
              left: '0.05',
              top: '0.3',
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
                text: 'Do you want to make a phonecall?',
                style: {
                  '.LabelStyle': {
                    left: '0',
                    top: '0.12',
                    width: '0.8',
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
                ],
                text: 'Cancel',
                style: {
                  '.LabelStyle': {
                    left: '0',
                    top: '0.275',
                    width: '0.4',
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
                    actionType: 'popUpDismiss',
                    popUpView: 'confirmView',
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        '=.Global.rootRoomInfo.edgeAPI.store': '',
                      },
                      {
                        '.Global._nonce@': {
                          '=.builtIn.math.random': '',
                        },
                      },
                      {
                        '..inviteMeeting.edge.id@': '',
                      },
                      {
                        '..inviteMeeting.edge.refid@':
                          '=.Global.rootRoomInfo.edge.edge.id',
                      },
                      {
                        '..inviteMeeting.edge.name.title@':
                          '=.Global.rootRoomInfo.edge.edge.name.title',
                      },
                      {
                        '=.ContactsList.inviteMeeting.edgeAPI.store': '',
                      },
                    ],
                  },
                  {
                    goto: 'MeetingLobby',
                  },
                ],
                text: 'Confirm',
                style: {
                  '.LabelStyle': {
                    left: '0.4',
                    top: '0.275',
                    width: '0.4',
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
    ],
  },
}
