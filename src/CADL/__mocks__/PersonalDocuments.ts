export default {
  PersonalDocuments: {
    pageNumber: '410',
    title: 'MyDocuments',
    init: ['.SignInCheck', '..listData.get'],
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
        ids: ['.Global.rootNotebookID'],
        type: '.DocType.UploadFile',
        xfname: 'eid',
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
            type: 'view',
            style: {
              top: '0.1',
              left: '0',
              width: '0.8',
              height: '0.7',
            },
            children: [
              {
                type: 'view',
                style: {
                  top: '0',
                  left: '0.05',
                  width: '0.9',
                  height: '0.08',
                },
                children: [
                  {
                    '.SearchField': null,
                    placeholder: '  Search Documents',
                    dataKey: '..searchData.searchContact',
                    style: {
                      left: '0.2',
                      top: '0.025',
                    },
                  },
                  {
                    '.SearchDoc': null,
                    style: {
                      top: '0.025',
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
                      top: '0.03',
                      left: '0.85',
                      height: '0.02',
                    },
                  },
                ],
              },
            ],
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
                      height: '0.07',
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
                        goto: 'DocumentDetail',
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
                        'text=func': '.builtIn.string.formatUnixtime_en',
                        dataKey: 'itemObject.ctime',
                        style: {
                          color: '0x808080',
                          left: '0.7',
                          top: '0.01',
                          width: '0.2',
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