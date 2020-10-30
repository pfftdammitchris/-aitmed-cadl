export default {
  MeetingDocumentsNotes: {
    pageNumber: '180',
    title: 'Meeting Notes',
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
      '..newNote.docAPI.get',
      {
        actionType: 'evalObject',
        object: {
          '.MeetingDocumentsNotes.newNote@': '=..docResponse.doc.0',
        },
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
        eid: '.Global.rootRoomInfo.edge.id',
        type: '6',
        name: {
          title: '',
          type: '..newNote.docAPI.store.subtype.mediaType',
          data: {
            note: '',
          },
        },
      },
      docAPI: {
        '.DocAPI': '',
        store: {
          dataKey: 'newNote.document',
          api: 'cd',
          subtype: {
            mediaType: 'text/plain',
          },
        },
        get: {
          '.DocAPI.get': '',
          ids: ['.Global.rootRoomInfo.edge.id'],
          xfname: 'eid',
          type: '6',
          maxcount: '1',
          obfname: 'mtime',
          dataKey: 'docResponse',
        },
      },
    },
    docResponse: {
      doc: [
        {
          type: '6',
          eid: '.Global.rootRoomInfo.edge.id',
          name: '',
        },
      ],
      error: '',
      jwt: '',
    },
    components: [
      {
        '.BaseHeader3': null,
      },
      {
        '.HeaderLeftButton': null,
        onClick: [
          {
            goto: 'VideoChat',
          },
        ],
      },
      {
        type: 'view',
        style: {
          top: '0.1',
          left: '0.1',
          width: '0.8',
          height: '0.08',
        },
        children: [
          {
            type: 'textField',
            placeholder: 'Title Here',
            dataKey: 'newNote.document.name.title',
            style: {
              top: '0.01',
              left: '0.05',
              height: '0.04',
              width: '0.7',
              color: '0x000000ff',
              fontWeight: '200',
              fontSize: 13,
              borderWidth: '1',
              border: {
                style: '2',
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
              },
              fontSize: '14',
              left: '0',
              top: '0.08',
              width: '0.8',
              height: '0.7',
              required: 'true',
              color: '0x000000ff',
              borderWidth: '1',
              border: {
                style: '0',
              },
            },
          },
          {
            type: 'button',
            text: 'save',
            style: {
              left: '0.05',
              height: '0.05',
              top: '0.8',
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
                object: '..save',
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
