export default {
  MeetingDocumentsNotes: {
    pageNumber: '180',
    title: 'Meeting Notes',
    init: [
      '.SignInCheck',
      '.MeetingDocumentsNotes.newNote.docAPI.get',
      {
        if: [
          '=..docResponse.doc.0',
          {
            '.MeetingDocumentsNotes.newNote.document@': '=..docResponse.doc.0',
          },
          'continue',
        ],
      },
      {
        '.MeetingDocumentsNotes.newNote.document.name.targetRoomName@':
          '=.Global.rootRoomInfo.edge.name.roomName',
      },
      '..listData.get',
    ],
    save: [
      {
        '=.MeetingDocumentsNotes.newNote.docAPI.store': '',
      },
      {
        '.MeetingDocumentsNotes.newChat.document.eid@':
          '=.Global.VideoChatObjStore.reference.edge.id',
      },
    ],
    newNote: {
      document: {
        '.Document': '',
        eid: '.Global.VideoChatObjStore.reference.edge.refid',
        type: '.DocType.UploadFile',
        name: {
          title: '',
          type: '..newNote.docAPI.store.subtype.mediaType',
          data: {
            note: '',
          },
          user: '.Global.currentUser.vertex.name.fullName',
          targetRoomName: '.Global.rootRoomInfo.edge.name.roomName',
        },
        subtype: {
          mediaType: 'text/plain',
        },
      },
      docAPI: {
        '.DocAPI': '',
        store: {
          api: 'cd',
          dataKey: 'newNote.document',
        },
        get: {
          '.DocAPI.get': '',
          api: 'rd',
          ids: ['.Global.VideoChatObjStore.reference.edge.refid'],
          xfname: 'eid',
          type: '.DocType.UploadFile',
          scondition: "name like '%application/json%'",
          maxcount: '1',
          obfname: 'mtime',
          dataKey: 'docResponse',
          _nonce: '=.Global._nonce',
        },
      },
    },
    docResponse: {
      doc: [
        {
          type: '.DocType.UploadFile',
          eid: '.Global.VideoChatObjStore.reference.edge.refid',
          name: '',
        },
      ],
      error: '',
      jwt: '',
    },
    newChat: {
      document: {
        '.Document': '',
        eid: '',
        type: '.DocType.MeetingNote',
        name: {
          title: '',
          type: '..newChat.docAPI.store.subtype.mediaType',
          data: {
            note: '',
          },
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
          dataKey: 'newChat.document',
        },
      },
    },
    listData: {
      chatList: {
        doc: [],
      },
      get: {
        '.DocAPI.get': '',
        api: 'rd',
        dataKey: 'listData.chatList',
        ids: ['.Global.VideoChatObjStore.reference.edge.id'],
        xfname: 'eid',
        type: '.DocType.MeetingNote',
        obfname: 'mtime',
        maxcount: '40',
        _nonce: '=.Global._nonce',
      },
    },
    components: [
      {
        '.BaseCheckView': '',
        message: 'Please input note title',
        viewTag: 'noTitle',
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
          left: '0',
          width: '1',
          height: '0.9',
        },
        children: [
          {
            type: 'textField',
            placeholder: 'Title Here',
            dataKey: 'newNote.document.name.title',
            style: {
              top: '0.01',
              left: '0.1',
              height: '0.04',
              width: '0.8',
              color: '0x000000ff',
              fontWeight: '200',
              fontSize: 13,
              borderWidth: '1',
              border: {
                style: '2',
              },
              textAlign: {
                x: 'center',
              },
            },
          },
          {
            type: 'scrollView',
            viewTag: 'ChatList',
            style: {
              top: '0.08',
              width: '1',
              height: '0.71',
              backgroundColor: '#ffffff',
              overflow: 'scroll',
            },
            children: [
              {
                type: 'list',
                contentType: 'listObject',
                listObject: '..listData.chatList.doc',
                iteratorVar: 'itemObject',
                style: {
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
                        dataKey: 'itemObject.name.data.note',
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
                          top: '0.05',
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
            placeholder: 'Text Here',
            dataKey: 'newChat.document.name.data.note',
            style: {
              textAlign: {
                y: 'top',
                x: 'left',
              },
              fontSize: '14',
              left: '0.05',
              top: '0.8',
              width: '0.6',
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
              left: '0.7',
              height: '0.07',
              top: '0.8',
              width: '0.3',
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
                object: [
                  {
                    if: [
                      '=..newNote.document.name.title',
                      'continue',
                      {
                        actionType: 'popUp',
                        popUpView: 'noTitle',
                        wait: true,
                      },
                    ],
                  },
                ],
              },
              {
                actionType: 'evalObject',
                object: {
                  '.MeetingDocumentsNotes.newNote.document.name.user@':
                    '=.Global.currentUser.vertex.name.fullName',
                },
              },
              {
                actionType: 'evalObject',
                object: '..save',
              },
              {
                actionType: 'evalObject',
                object: [
                  {
                    '=.MeetingDocumentsNotes.newChat.docAPI.store': '',
                  },
                  {
                    '.Global._nonce@': {
                      '=.builtIn.math.random': '',
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
}
