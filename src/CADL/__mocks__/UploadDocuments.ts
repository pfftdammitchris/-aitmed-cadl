export default {
  UploadDocuments: {
    pageNumber: '415',
    title: 'My Documents',
    init: ['.SignInCheck', '..listData.get'],
    listData: {
      personalDoc: {
        doc: {
          isSelected: false,
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
        maxcount: '20',
        _nonce: '=.Global._nonce',
      },
    },
    sharedDoc: '',
    sharedDocList: [],
    selectedDoc: {
      isSelected: false,
    },
    generalInfo: {
      value: true,
    },
    components: [
      {
        type: 'popUp',
        viewTag: 'uploading',
        style: {
          left: '0',
          width: '1',
          height: '1',
          top: '0',
          backgroundColor: '0xa9a9a9',
          zIndex: '10',
        },
        children: [
          {
            type: 'view',
            style: {
              width: '0.76',
              height: '0.2',
              top: '0.3',
              left: '0.12',
              zIndex: '100',
              backgroundColor: '0xe9e9e9',
              borderRadius: '7',
            },
            children: [
              {
                type: 'image',
                path: 'uploading.png',
                style: {
                  left: '0.05',
                  width: '0.2',
                  top: '0.03',
                },
              },
              {
                type: 'label',
                text: 'Uploading...',
                style: {
                  left: '0.29',
                  top: '0.04',
                  width: '0.42',
                  height: '0.07',
                  fontSize: '22',
                  fontWeight: '500',
                },
              },
              {
                type: 'label',
                textBoard: [
                  {
                    text: 'This may take a little while',
                  },
                  {
                    br: null,
                  },
                  {
                    text: 'depending on the file size',
                  },
                ],
                style: {
                  left: '0.12',
                  width: '0.62',
                  top: '0.135',
                  fontSize: '13',
                  height: '0.05',
                  textAlign: {
                    x: 'center',
                  },
                },
              },
            ],
          },
        ],
      },
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
          left: '0.04',
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
        type: 'view',
        style: {
          top: '0.17',
          width: '1',
          height: '0.8',
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
                viewTag: 'select',
                style: {
                  color: '0x000000',
                  backgroundColor: '0xFFFFFF',
                  left: '0',
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
                                    string2: '$var.isSelected',
                                  },
                                },
                              },
                              'https://public.aitmed.com/commonRes/selectOn.png',
                              'https://public.aitmed.com/commonRes/selectOff.png',
                            ],
                          },
                        ],
                      },
                    },
                    onClick: [
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
                                      string2: '$var.isSelected',
                                    },
                                  },
                                },
                                {
                                  '=.builtIn.object.clear': {
                                    dataIn: {
                                      object: '$var',
                                      key: 'isSelected',
                                    },
                                  },
                                },
                                {
                                  '=.builtIn.object.set': {
                                    dataIn: {
                                      object: '$var',
                                      key: 'isSelected',
                                      value: true,
                                    },
                                  },
                                },
                              ],
                            },
                            {
                              if: [
                                {
                                  '=.builtIn.string.equal': {
                                    dataIn: {
                                      string1: '=..generalInfo.value',
                                      string2: '$var.isSelected',
                                    },
                                  },
                                },
                                {
                                  '=.builtIn.array.add': {
                                    dataIn: {
                                      object: '=..sharedDocList',
                                      value: '$var',
                                    },
                                  },
                                },
                                {
                                  '=.builtIn.array.removeById': {
                                    dataIn: {
                                      object: '=..sharedDocList',
                                      id: '$var.id',
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
                    style: {
                      left: '0.1',
                      width: '0.5',
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
                      left: '0.6',
                      top: '0.02',
                      width: '0.3',
                      height: '0.02',
                      fontSize: '12',
                    },
                    textAlign: {
                      y: 'center',
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
            actionType: 'popUp',
            popUpView: 'uploading',
          },
          {
            actionType: 'evalObject',
            object: {
              '=.builtIn.ecos.shareDocList': {
                dataIn: {
                  sourceDocList: '=.UploadDocuments.sharedDocList',
                  targetEdgeID: '=.Global.rootRoomInfo.edge.id',
                  targetRoomName: '=.Global.rootRoomInfo.edge.name.roomName',
                },
              },
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
            actionType: 'builtIn',
            funcName: 'goBack',
            reload: true,
          },
        ],
        text: 'Share in meeting',
        style: {
          color: '0xFFFFFF',
          backgroundColor: '0x388eccff',
          left: '0.2',
          top: '0.92',
          width: '0.6',
          height: '0.05',
          border: {
            style: '5',
          },
          borderRadius: '0',
          display: 'inline',
          textAlign: {
            x: 'center',
            y: 'center',
          },
        },
      },
    ],
  },
}
