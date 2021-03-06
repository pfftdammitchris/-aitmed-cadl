export default {
  UploadSharedDocuments: {
    pageNumber: '415',
    title: 'Meeting Documents',
    init: ['.SignInCheck', '..listData.get'],
    listData: {
      sharedDoc: {
        doc: {
          name: {
            title: 'Urgent Care Evaluation Report',
          },
        },
      },
      get: {
        '.DocAPI.get': '',
        api: 'rd',
        dataKey: 'listData.sharedDoc',
        ids: ['.Global.rootRoomInfo.edge.id'],
        type: '.DocType.UploadFile',
        xfname: 'eid',
        obfname: 'mtime',
        maxcount: '20',
        _nonce: '=.Global._nonce',
      },
    },
    components: [
      {
        type: 'view',
        style: {
          width: '1',
          height: '1',
          left: '0',
          top: '0',
          position: 'fixed',
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
              width: '1',
              height: '0.1',
            },
            children: [
              {
                type: 'button',
                onClick: [
                  {
                    goto: 'UploadDocuments',
                  },
                ],
                text: 'My Documents',
                style: {
                  color: '0x388eccff',
                  left: '0.07',
                  top: '0.02',
                  width: '0.4',
                  height: '0.05',
                  border: {
                    style: '3',
                  },
                  borderRadius: '50',
                  borderWidth: '1',
                  backgroundColor: '0xffffff',
                  display: 'inline',
                  borderColor: '0x388eccff',
                  textAlign: {
                    x: 'center',
                    y: 'center',
                  },
                },
              },
              {
                type: 'button',
                onClick: [
                  {
                    goto: 'SharedDocuments',
                  },
                ],
                text: 'Upload',
                style: {
                  color: '0x388eccff',
                  left: '0.53',
                  top: '0.02',
                  width: '0.4',
                  height: '0.05',
                  border: {
                    style: '3',
                  },
                  borderRadius: '50',
                  display: 'inline',
                  borderWidth: '1',
                  backgroundColor: '0xffffff',
                  borderColor: '0x388eccff',
                  textAlign: {
                    x: 'center',
                    y: 'center',
                  },
                },
              },
            ],
          },
          {
            type: 'view',
            style: {
              top: '0.2',
              height: '0.7',
            },
            children: [
              {
                type: 'list',
                contentType: 'listObject',
                listObject: '..listData.sharedDoc.doc',
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
                                goto: 'DocumentNotes',
                              },
                              {
                                goto: 'DocumentDetail',
                              },
                            ],
                          },
                        ],
                      },
                    ],
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
                        type: 'label',
                        text: 'Urgent Care Evaluation Report',
                        dataKey: 'itemObject.name.title',
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
                        text: 'Room',
                        dataKey: 'itemObject.name.targetRoomName',
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
        ],
      },
    ],
  },
}
