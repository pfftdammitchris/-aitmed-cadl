export default {
  InboxContacts: {
    pageNumber: '350',
    title: 'Email Contacts',
    init: [
      '.SignInCheck',
      {
        actionType: 'evalObject',
        object: {
          '.Global._nonce@': {
            '=.builtIn.math.random': '',
          },
        },
      },
      '..userData.get',
    ],
    searchData: {
      searchContact: '',
    },
    userData: {
      userVertex: {
        vertex: null,
      },
      get: {
        '.VertexAPI.get': '',
        api: 'rv',
        dataKey: 'userData.userVertex',
        ids: ['.Global.currentUser.vertex.id'],
        ObjType: 4,
        sCondition: 'E.type=1053 AND V.uid IS NOT NULL AND V.type=1',
        xfname: 'E.bvid',
        obfname: 'mtime',
        maxcount: '20',
        _nonce: '=.Global._nonce',
      },
    },
    contactInfo: {
      document: '',
      docAPI: {
        '.DocAPI': '',
        store: {
          api: 'cd',
          dataKey: 'Contacts.contactInfo.document',
        },
      },
    },
    generalInfo: {
      value: true,
    },
    update: [
      {
        actionType: 'updateObject',
        dataKey: 'Global.inboxContact',
        dataObject: 'itemObject',
      },
      {
        actionType: 'evalObject',
        object: {
          '..inviteInbox.edgeAPI.get.refid@': '=.Global.inboxContact.id',
        },
      },
      {
        goto: 'NewMessage',
      },
    ],
    components: [
      {
        '.BaseHeader': null,
      },
      {
        '.HeaderLeftButton': null,
      },
      {
        '.HeaderRightImg': null,
        path: 'sideNav2.png',
        onClick: [
          {
            goto: 'InboxMenu',
          },
        ],
      },
      {
        type: 'view',
        style: {
          top: '0.1',
          left: '0',
          width: '1',
          height: '0.8',
        },
        children: [
          {
            type: 'view',
            style: {
              top: '0',
              left: '0',
              width: '1',
              height: '0.05',
            },
            children: [
              {
                '.SearchField': null,
                placeHolder: 'search contacts',
                style: {
                  left: '0.1',
                  top: '0.01',
                  width: '0.8',
                },
              },
              {
                '.SearchDoc': null,
                style: {
                  left: '0',
                  top: '0.01',
                },
              },
              {
                type: 'image',
                path: 'add.png',
                onClick: [
                  {
                    goto: 'AddHealthNetWork',
                  },
                ],
                style: {
                  top: '0.023',
                  left: '0.83',
                  height: '0.03',
                },
              },
              {
                type: 'label',
                contentType: 'messageHidden',
                text: 'No contacts added',
                style: {
                  left: '0.25',
                  top: '0.05',
                  width: '0.6',
                  height: '0.04',
                  color: '0x000058',
                  fontSize: '16',
                  isHidden: 'true',
                },
              },
            ],
          },
          {
            type: 'list',
            contentType: 'listObject',
            listObject: '..userData.userVertex.vertex',
            iteratorVar: 'itemObject',
            style: {
              top: '0.05',
              left: '0.05',
              width: '0.9',
              height: '0.9',
            },
            children: [
              {
                type: 'listItem',
                itemObject: '',
                onClick: [
                  {
                    actionType: 'updateObject',
                    dataKey: 'Global.inboxContact',
                    dataObject: 'itemObject',
                  },
                  {
                    goto: 'NewMessage',
                  },
                ],
                style: {
                  left: '0',
                  width: '0.9',
                  height: '0.1',
                  border: {
                    style: '2',
                  },
                  borderWidth: '1',
                  borderColor: '0x00000011',
                },
                children: [
                  {
                    type: 'label',
                    text: 'without data',
                    dataKey: 'itemObject.name.firstName',
                    style: {
                      left: '0',
                      top: '0.035',
                      height: '0.03',
                      width: '0.25',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    text: 'without data',
                    dataKey: 'itemObject.name.lastName',
                    style: {
                      left: '0.26',
                      top: '0.035',
                      height: '0.03',
                      width: '0.25',
                      textAlign: {
                        x: 'left',
                      },
                    },
                  },
                  {
                    type: 'label',
                    text: 'without data',
                    dataKey: 'itemObject.name.phoneNumber',
                    style: {
                      left: '0.65',
                      top: '0',
                      width: '0.5',
                      height: '0.1',
                      color: '0x00000088',
                      fontSize: '15',
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
    ],
  },
}
