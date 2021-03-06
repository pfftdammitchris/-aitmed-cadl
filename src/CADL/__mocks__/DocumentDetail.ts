export default {
  DocumentDetail: {
    pageNumber: '450',
    title: 'My Documents',
    init: [
      '.SignInCheck',
      {
        actionType: 'evalObject',
        object: {
          '.DocumentDetail.docDetail.document@':
            '=.Global.DocReference.document',
        },
      },
      {
        actionType: 'evalObject',
        object: {
          '=.builtIn.utils.prepareDoc': {
            dataIn: {
              doc: '=..docDetail.document',
            },
            dataOut: 'DocumentDetail.docDetail.document',
          },
        },
      },
      {
        if: [
          {
            '=.builtIn.EcosObj.Editable': {
              dataIn: {
                ecosObj: '..docDtail.document',
              },
            },
          },
          {
            actionType: 'builtIn',
            funcName: 'show',
            viewTag: 'updateButton',
          },
          {
            actionType: 'builtIn',
            funcName: 'hide',
            viewTag: 'updateButton',
          },
        ],
      },
      '..listData.get',
    ],
    save: [
      {
        '=.DocumentDetail.newChat.docAPI.store': '',
      },
    ],
    newChat: {
      document: {
        '.Document': '',
        eid: '=.Global.VideoChatObjStore.reference.edge.refid',
        fid: '=.DocumentDetail.docDetail.document.id',
        type: '.DocType.MeetingNote',
        name: {
          title: '',
          type: '=..newChat.document.subtype.mediaType',
          data: '',
          user: '.Global.currentUser.vertex.name.userName',
        },
        subtype: {
          mediaType: 'text/plain',
        },
      },
      docAPI: {
        '.DocAPI': '',
        store: {
          api: 'cd',
          dataIn: 'newChat.document',
        },
      },
    },
    listData: {
      chatList: {
        doc: {
          name: {
            title: 'No Title in DocumentList',
          },
        },
      },
      get: {
        '.DocAPI.get': '',
        api: 'rd',
        dataKey: 'listData.chatList',
        ids: ['=.DocumentDetail.docDetail.document.id'],
        xfname: 'fid',
        type: '.DocType.MeetingNote',
        obfname: 'ctime',
        maxcount: '40',
        _nonce: '.Global._nonce',
      },
    },
    listReGet: {
      chatList: {
        doc: {
          id: '=.DocumentDetail.docDetail.document.id',
          xfname: 'fid',
          type: '.DocType.MeetingNote',
          obfname: 'ctime',
          maxcount: '40',
          _nonce: '=.Global._nonce',
        },
      },
      get: {
        '.DocAPI.get': '',
        api: 'rd',
        dataIn: 'DocumentDetail.listReGet.chatList.doc',
        dataOut: 'DocumentDetail.listData.chatList',
      },
    },
    docDetail: {
      document: '',
      docAPI: {
        '.DocAPI': '',
        store: {
          dataIn: 'DocumentDetail.docDetail.document',
        },
        delete: {
          api: 'dx',
          dataIn: 'DocumentDetail.docDetail.document',
        },
      },
    },
    sharedDoc: '',
    components: [
      {
        '.BaseCheckView': '',
        message: 'already exists in My Document',
        viewTag: 'duplicate',
      },
      {
        '.BaseHeader3': null,
      },
      {
        '.HeaderLeftButton': null,
        onClick: [
          {
            actionType: 'evalObject',
            object: [
              {
                '.Global._nonce@': {
                  '=.builtIn.math.random': '',
                },
              },
            ],
          },
          {
            actionType: 'builtIn',
            funcName: 'goBack',
            reload: true,
          },
        ],
      },
      {
        '.HeaderRightButton': null,
        text: 'Update',
        viewTag: 'updateButton',
        onClick: [
          {
            actionType: 'evalObject',
            object: {
              '.Global.DocReference.document@':
                '=..DocumentDetail.docDetail.document',
            },
          },
          {
            goto: 'EditMyDocument',
          },
        ],
      },
      {
        type: 'view',
        style: {
          left: '0',
          top: '0.1',
          height: 'auto',
          width: '1',
        },
        children: [
          {
            type: 'label',
            dataKey: 'docDetail.document.name.title',
            style: {
              left: '0.15',
              top: '0.02',
              width: '0.7',
              height: '0.04',
              fontSize: '20',
              color: '0x000000',
              textAlign: {
                x: 'center',
              },
            },
          },
          {
            type: 'image',
            path: 'download2.png',
            onClick: [
              {
                actionType: 'evalObject',
                object: [
                  {
                    '=.builtIn.EcosObj.Downloadable': {
                      dataIn: {
                        ecosObj: '..docDtail.document',
                      },
                    },
                  },
                ],
              },
            ],
            style: {
              left: '0.8',
              top: '0.02',
              width: '0.1',
              height: '0.04',
              fontSize: '20',
              color: '0x000000',
              textAlign: {
                x: 'center',
              },
            },
          },
          {
            type: 'image',
            path: 'folder2.png',
            onClick: [
              {
                actionType: 'evalObject',
                object: [
                  {
                    '.Global.VideoChatObjStore.reference.edge.refid@':
                      '=.Global.DocReference.document.eid',
                  },
                  {
                    '.Global.VideoChatObjStore.reference.edge.name.title':
                      '=.Global.DocReference.document.name.targetRoomName',
                  },
                ],
              },
              {
                goto: 'UploadSharedDocuments',
              },
            ],
            style: {
              left: '0.9',
              top: '0.02',
              width: '0.1',
              height: '0.04',
              fontSize: '20',
              color: '0x000000',
              textAlign: {
                x: 'center',
              },
            },
          },
          {
            type: 'view',
            style: {
              left: '0.03',
              width: '0.94',
              top: '0.07',
              backgroundColor: '0xefefef',
              border: {
                style: '3',
              },
              borderRadius: '15',
            },
            children: [
              {
                type: 'label',
                text: 'Shared by: ',
                style: {
                  top: '0.015',
                  left: '0.04',
                  width: '0.2',
                  height: '0.03',
                  color: '0x00000099',
                  textAlign: {
                    x: 'left',
                  },
                },
              },
              {
                type: 'label',
                dataKey: 'docDetail.document.name.user',
                style: {
                  top: '0.015',
                  left: '0.1',
                  width: '0.4',
                  height: '0.03',
                  color: '0x000000',
                  textAlign: {
                    x: 'center',
                  },
                },
              },
              {
                type: 'label',
                'text=func': '=.builtIn.string.formatUnixtime_en',
                dataKey: 'docDetail.document.ctime',
                style: {
                  top: '0.015',
                  left: '0.4',
                  width: '0.55',
                  height: '0.03',
                  color: '0x000000',
                  textAlign: {
                    x: 'right',
                  },
                },
              },
            ],
          },
          {
            type: 'ecosDoc',
            ecosObj: '..docDetail.document',
            style: {
              left: '0.22',
              top: '0.15',
              width: '0.6',
              height: '0.4',
            },
          },
          {
            type: 'label',
            text: 'Comments: ',
            style: {
              left: '0.05',
              top: '0.53',
              width: '0.7',
              height: '0.04',
              fontSize: '12',
              color: '0x000000',
              textAlign: {
                x: 'left',
              },
            },
          },
          {
            type: 'scrollView',
            style: {
              top: '0.56',
              left: '0.05',
              width: '0.9',
              height: '0.2',
              backgroundColor: '#ffffff',
              overflow: 'scroll',
              border: {
                style: '3',
              },
              borderRadius: '15',
            },
            children: [
              {
                type: 'list',
                viewTag: 'ChatList',
                contentType: 'listObject',
                listObject: '..listData.chatList.doc',
                iteratorVar: 'itemObject',
                style: {
                  top: '0',
                  width: '0.9',
                  height: '0.19',
                },
                children: [
                  {
                    type: 'listItem',
                    itemObject: '',
                    style: {
                      left: '0',
                      width: '0.9',
                      height: '0.1',
                      border: {
                        style: '2',
                      },
                      borderWidth: '0.8',
                      borderColor: '0x00000011',
                      textAlign: {
                        y: 'center',
                      },
                    },
                    children: [
                      {
                        type: 'label',
                        dataKey: 'itemObject.name.data',
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
                        'text=func': '=.builtIn.string.formatUnixtimeLT_en',
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
                      {
                        type: 'label',
                        dataKey: 'itemObject.name.user',
                        style: {
                          color: '0x808080',
                          left: '0.7',
                          top: '0.04',
                          width: '0.3',
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
            type: 'textView',
            isEditable: 'true',
            viewTag: 'textInput',
            placeholder: 'Text Here',
            dataKey: 'newChat.document.name.data',
            style: {
              textAlign: {
                y: 'top',
                x: 'left',
              },
              fontSize: '14',
              left: '0.05',
              top: '0.8',
              width: '0.7',
              height: '0.06',
              required: 'true',
              fontFamily: 'sans-serif',
              color: '0x000000ff',
              borderWidth: '1',
              border: {
                style: '6',
              },
            },
          },
          {
            type: 'button',
            text: 'Send',
            style: {
              left: '0.8',
              height: '0.068',
              top: '0.8',
              width: '0.15',
              backgroundColor: '0x388ecc',
              color: '0xffffff',
              borderRadius: 2,
              textAlign: {
                x: 'center',
              },
            },
            onClick: [
              {
                actionType: 'evalObject',
                object: '..save',
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
                    '=..listReGet.get': '',
                  },
                ],
              },
              {
                actionType: 'builtIn',
                funcName: 'redraw',
                viewTag: 'ChatList',
              },
            ],
          },
        ],
      },
    ],
  },
}
