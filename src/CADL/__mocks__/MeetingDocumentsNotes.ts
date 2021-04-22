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
    ],
    save: [
      {
        '=.MeetingDocumentsNotes.newNote.docAPI.store': '',
      },
    ],
    newNote: {
      document: {
        '.Document': '',
        eid: '.Global.VideoChatObjStore.reference.edge.refid',
        fid: '.Global.VideoChatObjStore.reference.edge.refid',
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
          xfname: 'fid',
          type: '.DocType.UploadFile',
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
        onClick: [
          {
            actionType: 'evalObject',
            object: {
              '.Global._nonce@': {
                '=.builtIn.math.random': '',
              },
            },
          },
          {
            goto: 'VideoChat',
          },
        ],
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
              left: '0.15',
              height: '0.04',
              width: '0.7',
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
            type: 'textView',
            isEditable: 'true',
            placeholder: 'Text Here',
            dataKey: 'newNote.document.name.data.note',
            style: {
              textAlign: {
                y: 'top',
                x: 'left',
              },
              fontSize: '14',
              left: '0.1',
              top: '0.095',
              width: '0.8',
              height: '0.7',
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
            text: 'Save',
            style: {
              left: '0.15',
              height: '0.05',
              top: '0.84',
              width: '0.7',
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
                object: {
                  '.Global._nonce@': {
                    '=.builtIn.math.random': '',
                  },
                },
              },
              {
                goto: 'VideoChat',
              },
            ],
          },
        ],
      },
    ],
  },
}
