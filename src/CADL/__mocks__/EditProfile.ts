export default {
  EditProfile: {
    pageNumber: '310',
    title: 'Edit Profile',
    init: [
      '.SignInCheck',
      {
        if: [
          '=.DisplayProfile.docProfile.doc.0.name.type',
          {
            '..tar@': '.DisplayProfile.docDetail.document.name.data',
          },
          {
            '..tar@': 'empty.png',
          },
        ],
      },
    ],
    profileObject: '.DisplayProfile.profileObject',
    tar: '',
    save: [
      {
        '.Global.currentUser.vertex.name.firstName@':
          '=..profileObject.name.data.firstName',
      },
      {
        '.Global.currentUser.vertex.name.lastName@':
          '=..profileObject.name.data.lastName',
      },
      {
        actionType: 'evalObject',
        object: {
          '=.builtIn.string.concat': {
            dataIn: [
              '=.Global.currentUser.vertex.name.firstName',
              ' ',
              '=.Global.currentUser.vertex.name.lastName',
            ],
            dataOut: 'Global.currentUser.vertex.name.fullName',
          },
        },
      },
      {
        '=.EditProfile.profile.docAPI.store': '',
      },
      {
        '=.Global.currentUser.vertexAPI.store': '',
      },
    ],
    update: [
      {
        '=.EditProfile.uploadProfile.docAPI.store': '',
      },
    ],
    uploadProfile: {
      document: {
        '.Document': '',
        subtype: {
          isEncrypted: '1',
          isOnServer: '0',
        },
        type: '.DocType.UploadProfile',
        name: {
          title: '',
          type: '..uploadProfile.docAPI.store.subtype.mediaType',
          data: 'binFile',
        },
        deat: {
          sig: '',
          url: '',
        },
        eid: '.Global.rootNotebookID',
      },
      docAPI: {
        store: {
          api: 'cd',
          dataKey: 'uploadProfile.document',
          subtype: {
            mediaType: '',
          },
        },
      },
    },
    profile: {
      docAPI: {
        store: {
          api: 'cd',
          dataKey: 'EditProfile.profileObject',
        },
      },
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
            text: 'Cancel',
            onClick: [
              {
                goto: 'DisplayProfile',
              },
            ],
          },
          {
            type: 'image',
            path: '..tar',
            contentType: 'file',
            viewTag: 'avatarTag',
            style: {
              top: '0.15',
              width: '0.2',
              left: '0.1',
            },
          },
          {
            type: 'button',
            text: 'Change Image',
            onClick: [
              {
                actionType: 'openPhotoLibrary',
                dataObject: 'BLOB',
                dataKey: 'EditProfile.uploadProfile.document.name.data',
              },
              {
                actionType: 'updateObject',
                dataObject: 'BLOB',
                dataKey: 'EditProfile.uploadProfile.document.name.data',
              },
              {
                actionType: 'popUpDismiss',
                popUpView: 'selectView',
              },
              {
                actionType: 'builtIn',
                funcName: 'redraw',
                viewTag: 'avatarTag',
              },
              {
                actionType: 'evalObject',
                object: '..update',
              },
            ],
            style: {
              top: '0.35',
              left: '0.05',
              width: '0.3',
              height: '0.04',
              backgroundColor: '0xffffff',
              borderWidth: '0',
              color: '0x388ECC',
              textAlign: {
                x: 'center',
              },
            },
          },
          {
            type: 'view',
            style: {
              top: '0.12',
              left: '0.4',
              height: '0.2',
            },
            children: [
              {
                type: 'label',
                textBoard: [
                  {
                    text: 'First name',
                  },
                  {
                    text: '*',
                    color: '0xD53C42',
                  },
                ],
                style: {
                  top: '0',
                  fontSize: '18',
                  fontWeight: '400',
                  width: '0.5',
                  height: '0.04',
                },
              },
              {
                type: 'textField',
                placeholder: '.Global.currentUser.vertex.name.firstName',
                dataKey: 'profileObject.name.data.firstName',
                style: {
                  top: '0.04',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.5',
                  height: '0.02',
                  border: {
                    style: '3',
                  },
                  borderWidth: '1.5',
                  borderRadius: '5',
                },
              },
              {
                type: 'label',
                textBoard: [
                  {
                    text: 'Last name',
                  },
                  {
                    text: '*',
                    color: '0xD53C42',
                  },
                ],
                style: {
                  top: '0.1',
                  fontSize: '18',
                  fontWeight: '400',
                  width: '0.5',
                  height: '0.04',
                },
              },
              {
                type: 'textField',
                placeholder: '.Global.currentUser.vertex.name.lastName',
                dataKey: 'profileObject.name.data.lastName',
                style: {
                  top: '0.14',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.5',
                  height: '0.02',
                  border: {
                    style: '3',
                  },
                  borderWidth: '1.5',
                  borderRadius: '5',
                },
              },
            ],
          },
          {
            type: 'view',
            style: {
              top: '0.4',
              width: '0.9',
              left: '0.05',
              height: '0.35',
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
                  width: '0.9',
                  height: '0.05',
                  backgroundColor: '0x388FCD',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Contact Information',
                    style: {
                      top: '0.008',
                      width: '0.9',
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
                placeholder: '.Global.currentUser.vertex.uid',
                dataKey: 'profileObject.name.data.phone',
                isEdit: false,
                style: {
                  top: '0.07',
                  width: '0.5',
                  height: '0.03',
                  left: '0.35',
                  fontSize: '16',
                  fontWeight: '400',
                  color: '0xacacac',
                  border: {
                    style: '3',
                  },
                  borderWidth: '1',
                  borderRadius: '5',
                  textAlign: {
                    x: 'center',
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
                  width: '0.2',
                  height: '0.03',
                  left: '0.05',
                },
              },
              {
                type: 'textField',
                placeholder: 'example@domain.com',
                dataKey: 'profileObject.name.data.email',
                style: {
                  top: '0.11',
                  width: '0.59',
                  height: '0.03',
                  left: '0.25',
                  fontSize: '16',
                  fontWeight: '400',
                  border: {
                    style: '3',
                  },
                  borderWidth: '1',
                  borderRadius: '5',
                  textAlign: {
                    x: 'center',
                  },
                },
              },
              {
                type: 'label',
                text: 'Address',
                style: {
                  top: '0.15',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.35',
                  height: '0.03',
                  left: '0.05',
                },
              },
              {
                type: 'textField',
                placeholder: 'Line 1',
                dataKey: 'profileObject.name.data.line1',
                style: {
                  top: '0.15',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.59',
                  height: '0.03',
                  left: '0.25',
                  border: {
                    style: '3',
                  },
                  borderWidth: '1',
                  borderRadius: '5',
                },
              },
              {
                type: 'textField',
                placeholder: 'Line 2',
                dataKey: 'profileObject.name.data.line2',
                style: {
                  top: '0.19',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.59',
                  height: '0.03',
                  left: '0.25',
                  border: {
                    style: '3',
                  },
                  borderWidth: '1',
                  borderRadius: '5',
                },
              },
              {
                type: 'textField',
                placeholder: 'City',
                dataKey: 'profileObject.name.data.city',
                style: {
                  top: '0.23',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.18',
                  height: '0.03',
                  left: '0.25',
                  border: {
                    style: '3',
                  },
                  borderWidth: '1',
                  borderRadius: '5',
                },
              },
              {
                type: 'textField',
                placeholder: 'State',
                dataKey: 'profileObject.name.data.state',
                style: {
                  top: '0.23',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.18',
                  height: '0.03',
                  left: '0.455',
                  border: {
                    style: '3',
                  },
                  borderWidth: '1',
                  borderRadius: '5',
                },
              },
              {
                type: 'textField',
                placeholder: 'Zip code',
                dataKey: 'profileObject.name.data.zip',
                style: {
                  top: '0.23',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.18',
                  height: '0.03',
                  left: '0.66',
                  border: {
                    style: '3',
                  },
                  borderWidth: '1',
                  borderRadius: '5',
                },
              },
              {
                type: 'textField',
                placeholder: 'Country',
                dataKey: 'profileObject.name.data.country',
                style: {
                  top: '0.27',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.59',
                  height: '0.03',
                  left: '0.25',
                  border: {
                    style: '3',
                  },
                  borderWidth: '1',
                  borderRadius: '5',
                },
              },
            ],
          },
          {
            type: 'button',
            text: 'Save',
            onClick: [
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
                goto: 'DisplayProfile',
              },
            ],
            style: {
              top: '0.8',
              width: '0.5',
              left: '0.25',
              height: '0.05',
              backgroundColor: '0x398FCD',
              color: '0xffffff',
              textAlign: {
                x: 'center',
              },
            },
          },
        ],
      },
    ],
  },
}
