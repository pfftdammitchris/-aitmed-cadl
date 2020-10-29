export default {
  UploadDocuments: {
    pageNumber: '415',
    title: 'Documents',
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
      '..listData.get',
    ],
    save: [
      {
        '=.UploadDocuments.shareDocuments.docAPI.store': '',
      },
    ],
    listData: {
      personalDoc: {
        doc: {
          name: {
            title: 'Urgent Care Evaluation Report',
            isSelected: false,
          },
        },
      },
      get: {
        '.DocAPI.get': '',
        dataKey: 'listData.personalDoc',
        ObjType: 4,
        ids: ['.Global.rootNotebookID'],
        type: '4',
        xfname: 'eid',
        obfname: 'mtime',
        maxcount: '20',
      },
    },
    sharedDoc: '',
    selectedDoc: '',
    shareDocuments: {
      document: {
        type: '4',
      },
      docAPI: {
        '.DocAPI': '',
        store: {
          dataKey: 'shareDocuments.document',
          api: 'cd',
          subtype: {
            mediaType: '',
          },
        },
      },
    },
    components: [
      {
        '.BaseHeader3': null,
      },
      {
        '.HeaderLeftButton': null,
        onClick: [
          {
            goto: 'MeetingLobby',
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
              color: '0x000000',
              backgroundColor: '0xFFFFFF',
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
                  color: '0x000000',
                  backgroundColor: '0xFFFFFF',
                  left: '0',
                  top: '0',
                  width: '1',
                  height: '0.07',
                  border: {
                    style: '2',
                  },
                  borderWidth: '1',
                  borderColor: '0x00000011',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
                children: [
                  {
                    type: 'image',
                    viewTag: 'select',
                    dataKey: 'itemObject.name.isSelected',
                    path: {
                      if: [
                        'itemObject.name.isSelected',
                        'selectOn.png',
                        'selectOff.png',
                      ],
                    },
                    onClick: [
                      {
                        actionType: 'builtIn',
                        funcName: 'toggleFlag',
                        dataKey: 'itemObject.name.isSelected',
                      },
                      {
                        actionType: 'updateObject',
                        dataKey: 'UploadDocuments.selectedDoc',
                        dataObject: 'itemObject',
                      },
                    ],
                    style: {
                      top: '0.02',
                      left: '0.01',
                      height: '0.03',
                    },
                  },
                  {
                    type: 'label',
                    text: 'Urgent Care Evaluation Report',
                    dataKey: 'itemObject.name.title',
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
                    style: {
                      left: '0.1',
                      top: '0',
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
                      top: '0.02',
                      width: '0.2',
                      height: '0.02',
                      fontSize: '12',
                    },
                    textAlign: {
                      y: 'center',
                    },
                  },
                  {
                    type: 'label',
                    text: '10.30am',
                    'text=func': '.builtIn.string.formatUnixtime_en',
                    dataKey: 'itemObject.ctime',
                    style: {
                      color: '0x808080',
                      left: '0.1',
                      top: '0.04',
                      width: '0.7',
                      height: '0.02',
                      fontSize: '12',
                      textAlign: {
                        y: 'center',
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'button',
        onClick: [
          {
            actionType: 'evalObject',
            object: {
              '.UploadDocuments.selectedDoc.type@': 4,
              '=.builtIn.ecos.shareDoc': {
                dataIn: {
                  sourceDoc: '=.UploadDocuments.selectedDoc',
                  targetEdgeID: '=.Global.rootRoomInfo.edge.id',
                },
                dataOut: '=.UploadDocuments.sharedDoc',
              },
            },
          },
          // {
          //   actionType: 'evalObject',
          //   object: '..save',
          // },
          {
            goto: 'MeetingLobby',
          },
        ],
        text: 'Submit',
        style: {
          color: '0xFFFFFF',
          background: '0x388eccff',
          left: '0.2',
          top: '0.85',
          width: '0.6',
          height: '0.05',
          border: {
            style: '5',
          },
          borderRadius: '0',
        },
      },
    ],
  },
}
