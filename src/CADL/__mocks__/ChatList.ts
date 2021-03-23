export default {
  ChatList: {
    init: ['.SignInCheck', '=..contacts.get'],
    contacts: {
      list: '',
      get: {
        '.EdgeAPI.get': '',
        dataKey: 'contacts.list',
        id: '.Global.currentUser.vertex.id',
        type: 1091,
        xfname: 'id=refid AND bvid|evid',
        maxcount: 20,
        obfname: 'mtime',
      },
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
            type: 'view',
            style: {
              left: '0',
              top: '0',
              width: '1',
              height: '0.2',
              backgroundColor: '0x388eccff',
            },
            children: [
              {
                type: 'label',
                text: 'Chat List',
                style: {
                  color: '0xffffffff',
                  left: '0.1',
                  top: '0.08',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '20',
                  fontStyle: 'bold',
                },
              },
            ],
          },
          {
            type: 'list',
            contentType: 'listObject',
            listObject: '..contacts.list.edge',
            iteratorVar: 'itemObject',
            style: {
              left: '0',
              top: '0.2',
              width: '1',
              height: '0.8',
            },
            children: [
              {
                type: 'listItem',
                itemObject: '',
                onClick: [
                  {
                    actionType: 'updateObject',
                    dataKey: 'MessageObjStore.currentChatEdge',
                    dataObject: 'itemObject',
                  },
                  {
                    actionType: 'pageJump',
                    destination: 'ChatPage',
                  },
                ],
                style: {
                  left: '0',
                  top: '0',
                  width: '1',
                  height: '0.15',
                  border: {
                    style: '2',
                  },
                  borderWidth: '1',
                  borderColor: '0x00000011',
                },
                children: [
                  {
                    type: 'label',
                    dataKey: 'itemObject.name.InviterName',
                    style: {
                      left: '0.08',
                      top: '0.03',
                      width: '0.15',
                      height: '0.08',
                      fontSize: '32',
                      fontStyle: 'bold',
                      color: '0xffffffff',
                      backgroundColor: '0xff8f90ff',
                      display: 'inline',
                      textAlign: {
                        x: 'center',
                        y: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'itemObject.name.InviteePhoneNumber',
                    style: {
                      left: '0.25',
                      top: '0.06',
                      width: '0.74',
                      height: '0.03',
                      fontSize: '18',
                      color: '0x000000ff',
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'image',
            path: 'addMeeting.png',
            onClick: [
              {
                actionType: 'pageJump',
                destination: 'NewChat',
              },
            ],
            style: {
              left: '0.7',
              top: '0.75',
              width: '0.14',
              height: '0.08',
              backgroundColor: '0x388eccff',
              border: {
                style: '5',
              },
              borderRadius: '100',
            },
          },
        ],
      },
    ],
  },
}
