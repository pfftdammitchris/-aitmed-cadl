export default {
  PersonalDocuments: {
    pageNumber: '410',
    title: 'My Documents',
    init: [
      '.SignInCheck',
      '..listData.get',
      {
        if: [
          '=..listData.personalDoc.doc.0',
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
    listData: {
      personalDoc: {
        doc: {
          name: {
            title: 'No Title in DocumentList',
          },
        },
      },
      get: {
        '.DocAPI.get': '',
        api: 'rd',
        dataKey: 'listData.personalDoc',
        ObjType: 4,
        ids: ['.Global.currentUser.vertex.id'],
        // sCondition: '.DocType.GetAllDocument',
        xfname: 'E.bvid|E.evid',
        obfname: 'mtime',
        maxcount: '40',
        _nonce: '=.Global._nonce',
      },
    },
    searchData: {
      searchContact: '',
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
            type: 'view',
            style: {
              top: '0.1',
              left: '0.05',
              width: '0.9',
              height: '0.08',
            },
            children: [
              {
                '.SearchField': null,
                placeholder: '  Search Documents',
                style: {
                  left: '0.1',
                  top: '0.025',
                },
              },
              {
                '.SearchDoc': null,
                style: {
                  top: '0.026',
                  left: '0.75',
                },
              },
              {
                type: 'image',
                path: 'add.png',
                onClick: [
                  {
                    goto: 'AddDocuments',
                  },
                ],
                style: {
                  top: '0.024',
                  left: '0',
                  height: '0.03',
                },
              },
            ],
          },
          {
            type: 'label',
            contentType: 'messageHidden',
            text: 'No documents added',
            style: {
              left: '0',
              top: '0.18',
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
            type: 'view',
            style: {
              top: '0.17',
            },
            children: [
              {
                type: 'list',
                contentType: 'listObject',
                listObject: '..listData.personalDoc.doc',
                iteratorVar: 'itemObject',
                style: {
                  left: '0.05',
                  top: '0',
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
                            if: [
                              '=.Global.DocReference.document.name.data.note',
                              {
                                goto: 'MyDocumentNotes',
                              },
                              {
                                goto: 'MyDocumentDetail',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    children: [
                      {
                        type: 'label',
                        text: 'Urgent Care Evaluation Report',
                        dataKey: 'itemObject.name.title',
                        style: {
                          left: '0.05',
                          top: '0.02',
                          width: '0.7',
                          height: '0.02',
                          fontSize: '13',
                          fontWeight: '500',
                          textAlign: {
                            y: 'center',
                          },
                        },
                      },
                      {
                        type: 'label',
                        text: '10.30am',
                        'text=func': '=.builtIn.string.formatUnixtime_en',
                        dataKey: 'itemObject.ctime',
                        style: {
                          color: '0x808080',
                          left: '0.05',
                          top: '0.06',
                          width: '0.4',
                          height: '0.02',
                          fontSize: '12',
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
    ],
  },
}
