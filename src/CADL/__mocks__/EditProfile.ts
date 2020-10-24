export default {
  EditProfile: {
    pageNumber: '310',
    title: 'Edit Profile',
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
    ],
    save: [
      {
        '=.EditProfile.profile.docAPI.store': '',
      },
    ],
    profile: {
      document: '.DisplayProfile.profile.document',
      docAPI: {
        store: {
          api: 'cd',
          dataOut: 'profile.document',
          dataIn: 'profile.document',
          subtype: {
            mediaType: '',
          },
          condition: {
            isPlain: 'text/plain',
            isJpeg: 'image/jpeg',
            isPng: 'image/png',
          },
        },
      },
    },
    components: [
      {
        type: 'view',
        style: {
          left: '0',
          top: '0',
          width: '1',
          height: '1.7',
        },
        children: [
          {
            '.BaseHeader': null,
          },
          {
            '.HeaderRightButton': null,
            text: 'Cancel',
            onClick: [
              {
                goto: 'DisplayProfile',
              },
            ],
          },
          {
            type: 'image',
            contentType: 'file',
            onClick: [
              {
                actionType: 'updateObject',
                dataObject: 'BLOB',
                dataKey: 'profile.document.name.data.avatarUrl',
              },
            ],
            path: 'drImg.png',
            style: {
              left: '0.39',
              top: '0.12',
              width: '0.22',
              border: {
                style: '5',
              },
              borderRadius: 1000,
            },
          },
          {
            type: 'image',
            backgourndColor: '0xe0dfe6ff',
            path: 'chooseAvatar2.png',
            style: {
              left: '0.38',
              top: '0.2',
              width: '0.05',
              border: {
                style: '5',
              },
              borderRadius: 10000,
            },
          },
          {
            type: 'view',
            style: {
              top: '0.25',
            },
            children: [
              {
                type: 'label',
                text: 'Aitmed ID',
                style: {
                  left: '0.15',
                  top: '0.01',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '12',
                  color: '0x000000',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'label',
                dataKey: 'Global.currentUser.vertex.id',
                style: {
                  left: '0.35',
                  top: '0.25',
                  width: '0.5',
                  height: '0.04',
                  fontSize: '12',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                  color: '0x00000058',
                  border: {
                    style: '2',
                    width: '1',
                  },
                },
              },
              {
                type: 'label',
                text: 'Phone #',
                style: {
                  left: '0.15',
                  top: '0.3',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '12',
                  color: '0x000000',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'label',
                dataKey: 'Global.currentUser.vertex.uid',
                contentType: 'text',
                style: {
                  left: '0.15',
                  top: '0.35',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '16',
                  color: '0x00000058',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                  border: {
                    style: '2',
                    width: '1',
                    color: '0x00000058',
                  },
                },
              },
              {
                type: 'label',
                text: 'Email',
                style: {
                  left: '0.15',
                  top: '0.4',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '12',
                  color: '0x000000',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'textField',
                placeholder: 'your email',
                dataKey: 'profile.document.name.data.email',
                contentType: 'text',
                style: {
                  left: '0.15',
                  top: '0.45',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '16',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                  border: {
                    style: '2',
                    width: '1',
                    color: '0x00000058',
                  },
                },
              },
              {
                type: 'label',
                text: 'First name',
                style: {
                  left: '0.15',
                  top: '0.5',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '12',
                  color: '0x000000',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'textField',
                placeholder: 'your first name',
                dataKey: 'profile.document.name.data.firstName',
                contentType: 'text',
                required: 'true',
                style: {
                  left: '0.15',
                  top: '0.55',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '16',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                  border: {
                    style: '2',
                    width: '1',
                    color: '0x00000058',
                  },
                },
              },
              {
                type: 'label',
                text: 'Middle name',
                style: {
                  left: '0.15',
                  top: '0.6',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '12',
                  color: '0x000000',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'textField',
                placeholder: 'your middle name',
                dataKey: 'profile.document.name.data.middleName',
                contentType: 'text',
                style: {
                  left: '0.15',
                  top: '0.65',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '16',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                  border: {
                    style: '2',
                    width: '1',
                    color: '0x00000058',
                  },
                },
              },
              {
                type: 'label',
                text: 'Last name',
                style: {
                  left: '0.15',
                  top: '0.7',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '12',
                  color: '0x000000',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'textField',
                placeholder: 'your last name',
                dataKey: 'profile.document.name.data.lastName',
                contentType: 'text',
                style: {
                  left: '0.15',
                  top: '0.75',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '16',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                  border: {
                    style: '2',
                    width: '1',
                    color: '0x00000058',
                  },
                },
              },
              {
                type: 'label',
                text: 'Mailing address',
                style: {
                  left: '0.15',
                  top: '0.8',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '12',
                  color: '0x000000',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'textField',
                placeholder: 'your mail address',
                dataKey: 'profile.document.name.data.mailingAddress',
                contentType: 'text',
                style: {
                  left: '0.15',
                  top: '0.85',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '16',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                  border: {
                    style: '2',
                    width: '1',
                    color: '0x00000058',
                  },
                },
              },
              {
                type: 'label',
                text: 'City',
                style: {
                  left: '0.15',
                  top: '0.9',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '12',
                  color: '0x000000',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'textField',
                placeholder: 'your city',
                dataKey: 'profile.document.name.data.city',
                contentType: 'text',
                style: {
                  left: '0.15',
                  top: '0.95',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '16',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                  border: {
                    style: '2',
                    width: '1',
                    color: '0x00000058',
                  },
                },
              },
              {
                type: 'label',
                text: 'State',
                style: {
                  left: '0.15',
                  top: '1',
                  width: '0.325',
                  height: '0.04',
                  fontSize: '12',
                  color: '0x000000',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'select',
                dataKey: 'profile.document.name.data.state',
                style: {
                  left: '0.15',
                  top: '1.05',
                  width: '0.325',
                  height: '0.04',
                  border: {
                    style: '2',
                    width: '1',
                    color: '0x00000058',
                  },
                },
                backgroundColor: '0xffffff',
                options: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO'],
              },
              {
                type: 'label',
                text: 'Zip',
                style: {
                  left: '0.525',
                  top: '1',
                  width: '0.325',
                  height: '0.04',
                  fontSize: '12',
                  color: '0x000000',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'textField',
                placeholder: 'your zip',
                dataKey: 'profile.document.name.data.zip',
                contentType: 'text',
                style: {
                  left: '0.525',
                  top: '1.05',
                  width: '0.325',
                  height: '0.04',
                  fontSize: '16',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                  border: {
                    style: '2',
                    width: '1',
                    color: '0x00000058',
                  },
                },
              },
              {
                type: 'label',
                text: 'Language',
                style: {
                  left: '0.15',
                  top: '1.1',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '12',
                  color: '0x000000',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'textField',
                placeholder: 'your language',
                dataKey: 'profile.document.name.data.language',
                contentType: 'text',
                style: {
                  left: '0.15',
                  top: '1.15',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '16',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                  border: {
                    style: '2',
                    width: '1',
                    color: '0x00000058',
                  },
                },
              },
              {
                type: 'label',
                text: 'Add note',
                style: {
                  left: '0.15',
                  top: '1.2',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '12',
                  color: '0x000000',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'textField',
                placeholder: 'please add notes here',
                dataKey: 'profile.document.name.data.note',
                contentType: 'text',
                style: {
                  left: '0.15',
                  top: '1.25',
                  width: '0.7',
                  height: '0.15',
                  fontSize: '16',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                  border: {
                    style: '3',
                    width: '1',
                    color: '0x00000058',
                  },
                },
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
                    actionType: 'updateObject',
                    dataKey: 'Global.profile.document',
                    dataObject: '..profile.document',
                  },
                  {
                    goto: 'DisplayProfile',
                  },
                ],
                style: {
                  left: '0.2',
                  top: '1.44',
                  width: '0.6',
                  height: '0.0493',
                  fontWeight: 400,
                  color: '0xffffffff',
                  backgroundColor: '0x3366FF',
                  borderRadius: 2,
                  textAlign: {
                    x: 'center',
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
