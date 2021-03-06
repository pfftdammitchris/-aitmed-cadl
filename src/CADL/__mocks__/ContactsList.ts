export default {
  ContactsList: {
    pageNumber: '340',
    title: 'My Directory',
    init: [
      '.SignInCheck',
      '..listData.get',
      {
        if: [
          '..listData.contactList.doc.0',
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
    save: [
      {
        '=.ContactsList.contactInfo.docAPI.store': '',
      },
    ],
    searchData: {
      searchContact: '',
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
    contactInfo: {
      document: '',
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
                text: 'Contacts',
                style: {
                  top: '0.03',
                  left: '0.15',
                  color: '0xffffffff',
                },
                onClick: [
                  {
                    goto: 'ContactsList',
                  },
                ],
              },
              {
                '.SubMenuButton': null,
                text: 'Favorites',
                style: {
                  top: '0.03',
                  left: '0.5',
                },
                onClick: [
                  {
                    goto: 'FavoriteList',
                  },
                ],
              },
            ],
          },
          {
            type: 'view',
            style: {
              top: '0.1',
              left: '0',
              width: '0.8',
              height: '0.8',
            },
            children: [
              {
                type: 'view',
                style: {
                  top: '0.1',
                  left: '0.05',
                  width: '0.9',
                  height: '0.05',
                },
                children: [
                  {
                    '.SearchField': null,
                    placeHolder: 'search contacts',
                    style: {
                      left: '0.2',
                      top: '0.01',
                    },
                  },
                  {
                    '.SearchDoc': null,
                    style: {
                      top: '0.01',
                    },
                  },
                  {
                    type: 'image',
                    path: 'add.png',
                    onClick: [
                      {
                        goto: 'AddContact',
                      },
                    ],
                    style: {
                      top: '0.015',
                      left: '0.83',
                      height: '0.03',
                    },
                  },
                  {
                    type: 'label',
                    contentType: 'messageHidden',
                    text: 'No contacts added',
                    style: {
                      left: '0.31',
                      top: '0.05',
                      width: '0.72',
                      height: '0.04',
                      color: '0x000058',
                      fontSize: '16',
                      isHidden: 'true',
                    },
                  },
                ],
              },
              {
                type: 'list',
                contentType: 'listObject',
                listObject: '..listData.contactList.doc',
                iteratorVar: 'itemObject',
                style: {
                  top: '0.15',
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
                      top: '0',
                      width: '1',
                      height: '0.1',
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
                        ],
                      },
                      {
                        type: 'image',
                        path: 'drImg.png',
                        style: {
                          borderRadius: '10000',
                          height: '0.07',
                          top: '0.015',
                          left: '0.13',
                        },
                      },
                      {
                        type: 'label',
                        dataKey: 'itemObject.name.data.firstName',
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
                          left: '0.3',
                          height: '0.1',
                          width: '0.45',
                          textAlign: {
                            y: 'center',
                          },
                        },
                      },
                      {
                        type: 'image',
                        path: 'rightYellowArrow.png',
                        style: {
                          left: '0.82',
                          top: '0.03',
                          height: '0.03',
                          zIndex: 1000,
                        },
                        onClick: [
                          {
                            goto: 'ContactInformation',
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
    ],
  },
}
