export default {
  DisplayProfile: {
    pageNumber: '330',
    title: 'My Profile',
    init: [
      '.SignInCheck',
      '..profile.docAPI.get',
      '..profilePic.docAPI.get',
      {
        if: [
          '=..docResponse.doc.0',
          {
            actionType: 'evalObject',
            object: {
              '.DisplayProfile.profileObject@': '=..docResponse.doc.0',
            },
          },
          'continue',
        ],
      },
      {
        if: [
          '=..docResponse.doc.0',
          {
            actionType: 'evalObject',
            object: {
              '.Global.DocProfile.document@': '=..docProfile.doc.0',
            },
          },
          'continue',
        ],
      },
      {
        if: [
          '=..docResponse.doc.0',
          {
            actionType: 'evalObject',
            object: {
              '.DisplayProfile.docDetail.document@':
                '=.Global.DocProfile.document',
            },
          },
          'continue',
        ],
      },
      {
        if: [
          '=..docProfile.doc.0',
          {
            actionType: 'evalObject',
            object: {
              '=.builtIn.utils.prepareDoc': {
                dataIn: {
                  doc: '=..docDetail.document',
                },
                dataOut: 'DisplayProfile.docDetail.document',
              },
            },
          },
          'continue',
        ],
      },
      {
        if: [
          '=..docProfile.doc.0.name.type',
          {
            '..tar@': '..docDetail.document.name.data',
          },
          {
            '..tar@': 'empty.png',
          },
        ],
      },
      {
        if: [
          '=..docProfile.doc.0',
          {
            '.Global.currentUser.vertex.name.avatar@':
              '..docDetail.document.name.data',
          },
          'continue',
        ],
      },
      {
        if: [
          '=..profileObject.name.data.firstName',
          {
            actionType: 'evalObject',
            object: {
              '=.builtIn.string.concat': {
                dataIn: [
                  '=..profileObject.name.data.firstName',
                  ' ',
                  '=..profileObject.name.data.lastName',
                ],
                dataOut: 'DisplayProfile.concatInfo.name',
              },
            },
          },
          'continue',
        ],
      },
      {
        if: [
          '=..profileObject.name.data',
          {
            actionType: 'evalObject',
            object: {
              '=.builtIn.string.concat': {
                dataIn: [
                  '=..profileObject.name.data.line1',
                  ' ',
                  '=..profileObject.name.data.line2',
                ],
                dataOut: 'DisplayProfile.concatInfo.address1',
              },
            },
          },
          'continue',
        ],
      },
      {
        if: [
          '=..profileObject.name.data',
          {
            actionType: 'evalObject',
            object: {
              '=.builtIn.string.concat': {
                dataIn: [
                  '=..profileObject.name.data.city',
                  ' ',
                  '=..profileObject.name.data.state',
                  ' ',
                  '=..profileObject.name.data.zip',
                ],
                dataOut: 'DisplayProfile.concatInfo.address2',
              },
            },
          },
          'continue',
        ],
      },
      {
        if: [
          '=..profileObject.name.data',
          {
            actionType: 'evalObject',
            object: {
              '=.builtIn.string.concat': {
                dataIn: ['=..profileObject.name.data.country'],
                dataOut: 'DisplayProfile.concatInfo.address3',
              },
            },
          },
          'continue',
        ],
      },
    ],
    concatInfo: {
      name: '',
      address1: '',
      address2: '',
      address3: '',
    },
    docDetail: {
      document: {
        name: {
          data: 'drImg.png',
        },
      },
    },
    tar: '',
    profileObject: {
      '.Document': '',
      eid: '.Global.rootNotebookID',
      type: '.DocType.Profile',
      name: {
        title: '',
        type: 'application/json',
        data: {
          phone: '.Global.currentUser.vertex.uid',
          userName: '.Global.currentUser.vertex.name.userName',
          email: '',
          firstName: '.Global.currentUser.vertex.name.firstName',
          lastName: '.Global.currentUser.vertex.name.lastName',
          line1: '',
          line2: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        },
      },
    },
    profile: {
      docAPI: {
        get: {
          '.DocAPI.get': '',
          api: 'rd',
          ids: ['.Global.rootNotebookID'],
          xfname: 'eid',
          type: '.DocType.Profile',
          obfname: 'mtime',
          maxcount: '1',
          dataKey: 'docResponse',
          _nonce: '=.Global._nonce',
        },
      },
    },
    docResponse: {
      doc: [],
      error: '',
      jwt: '',
    },
    profilePic: {
      docAPI: {
        get: {
          '.DocAPI.get': '',
          api: 'rd',
          ids: ['.Global.rootNotebookID'],
          xfname: 'eid',
          type: '.DocType.UploadProfile',
          obfname: 'mtime',
          maxcount: '1',
          dataKey: 'docProfile',
          _nonce: '=.Global._nonce',
        },
      },
    },
    docProfile: {
      doc: [],
      error: '',
      jwt: '',
    },
    components: [
      {
        type: 'view',
        style: {
          top: '0',
          width: '1',
          height: '1',
        },
        children: [
          {
            '.BaseHeader3': null,
          },
          {
            '.HeaderLeftButton2': null,
            text: 'Edit',
            onClick: [
              {
                goto: 'EditProfile',
              },
            ],
          },
          {
            '.HeaderRightImg': null,
            path: 'sideNav2.png',
            onClick: [
              {
                goto: 'SideMenuBar',
              },
            ],
          },
          {
            type: 'image',
            path: '..tar',
            style: {
              top: '0.15',
              width: '0.2',
              left: '0.1',
            },
          },
          {
            type: 'view',
            style: {
              top: '0.15',
              left: '0.35',
              width: '0.65',
              height: '0.15',
            },
            children: [
              {
                type: 'label',
                dataKey: 'DisplayProfile.concatInfo.name',
                style: {
                  top: '0.01',
                  fontSize: '20',
                  fontWeight: '500',
                  width: '0.5',
                  height: '0.04',
                  textAlign: {
                    x: 'left',
                  },
                },
              },
              {
                type: 'label',
                text: 'Username:',
                style: {
                  top: '0.05',
                  fontSize: '20',
                  fontWeight: '400',
                  width: '0.25',
                  height: '0.04',
                },
              },
              {
                type: 'label',
                dataKey: 'Global.currentUser.vertex.name.userName',
                style: {
                  left: '0.28',
                  top: '0.055',
                  fontSize: '20',
                  fontWeight: '400',
                  width: '0.17',
                  height: '0.04',
                  textAlign: {
                    x: 'right',
                  },
                },
              },
            ],
          },
          {
            type: 'view',
            style: {
              top: '0.3',
              width: '0.8',
              left: '0.1',
              height: '0.4',
              border: {
                style: '3',
              },
              borderWidth: '1',
              borderColor: '0x388FCD',
              borderRadius: '5',
            },
            children: [
              {
                type: 'view',
                style: {
                  width: '0.8',
                  height: '0.05',
                  backgroundColor: '0x388FCD',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Contact Information',
                    style: {
                      top: '0.008',
                      width: '0.8',
                      height: '0.03',
                      fontSize: '20',
                      color: '0xffffff',
                      fontWeight: '400',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                ],
              },
              {
                type: 'label',
                text: 'Phone number',
                style: {
                  top: '0.07',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.35',
                  height: '0.03',
                  left: '0.05',
                },
              },
              {
                type: 'label',
                dataKey: 'Global.currentUser.vertex.uid',
                style: {
                  top: '0.07',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.3',
                  height: '0.03',
                  left: '0.4',
                  textAlign: {
                    x: 'right',
                  },
                },
              },
              {
                type: 'label',
                text: 'Email',
                style: {
                  top: '0.11',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.35',
                  height: '0.03',
                  left: '0.05',
                },
              },
              {
                type: 'label',
                dataKey: 'profileObject.name.data.email',
                style: {
                  top: '0.15',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.6',
                  height: '0.03',
                  left: '0.1',
                  border: {
                    style: '2',
                  },
                  borderWidth: '1',
                  textAlign: {
                    x: 'right',
                  },
                },
              },
              {
                type: 'label',
                text: 'Address',
                style: {
                  top: '0.2',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.35',
                  height: '0.03',
                  left: '0.05',
                },
              },
              {
                type: 'label',
                dataKey: 'DisplayProfile.concatInfo.address1',
                style: {
                  top: '0.25',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.6',
                  height: '0.03',
                  left: '0.1',
                  textAlign: {
                    x: 'right',
                  },
                },
              },
              {
                type: 'label',
                dataKey: 'DisplayProfile.concatInfo.address2',
                style: {
                  top: '0.28',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.6',
                  height: '0.03',
                  left: '0.1',
                  textAlign: {
                    x: 'right',
                  },
                },
              },
              {
                type: 'label',
                dataKey: 'DisplayProfile.concatInfo.address3',
                style: {
                  top: '0.31',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.6',
                  height: '0.03',
                  left: '0.1',
                  textAlign: {
                    x: 'right',
                  },
                  border: {
                    style: '2',
                    borderWidth: '1',
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
}
