export default {
  Settings: {
    title: 'Settings',
    init: ['.SignInCheck'],
    formData: {
      response: '',
      vertex: {
        '.Global.currentUser.vertex': '',
        type: '1',
        name: {
          countryCode: '',
          phoneNumber: '',
          userName: '',
          firstName: '',
          lastName: '',
          password: '',
          confirmPassword: '',
          verificationCode: '',
        },
      },
      vertexAPI: {
        '.VertexAPI': '',
        store: {
          api: 'cv',
          dataIn: 'formData.vertex',
          dataOut: 'formData.response',
        },
      },
      target: false,
      tar: false,
      confirm: '',
    },
    save: [{ '=..formData.vertexAPI.store': '' }],
    update: [
      {
        '.Global.currentUser.vertex@': '=..formData.response.vertex',
      },
      {
        '.Global.currentUser.vertex.name.firstName@':
          '=..formData.vertex.name.firstName',
      },
      {
        '.Global.currentUser.vertex.name.lastName@':
          '=..formData.vertex.name.lastName',
      },
      {
        '.Global.currentUser.JWT@': '=..formData.response.jwt',
      },
      {
        '.Global.rootNotebookID@': '=.Global.currentUser.vertex.deat.rnb64ID',
      },
      {
        '.Global.currentUser.dataCache.loadingDateTime@':
          '=.Global.currentDateTime',
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
    ],
    components: [
      {
        type: 'view',
        style: {
          top: '0',
          left: '0',
          width: '1',
          height: '1',
        },
        children: [
          {
            '.BaseHeader3': null,
          },
          {
            '.HeaderLeftButton': null,
            onClick: [
              {
                goto: 'MeetingRoomCreate',
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
            type: 'view',
            style: {
              top: '0.12',
              left: '0.1',
              width: '1',
              height: '1',
            },
            children: [
              {
                type: 'label',
                textBoard: [
                  {
                    text: 'First Name:',
                  },
                  {
                    text: '*',
                    color: '0xD53C42',
                  },
                ],
                style: {
                  top: '0.05',
                  fontSize: '18',
                  fontWeight: '400',
                  width: '0.5',
                  height: '0.03',
                },
              },
              {
                type: 'textField',
                placeholder: '.Global.currentUser.vertex.name.firstName',
                dataKey: 'formData.vertex.name.firstName',
                style: {
                  top: '0.05',
                  left: '0.28',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.5',
                  height: '0.03',
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
                    text: 'Last Name:',
                  },
                  {
                    text: '*',
                    color: '0xD53C42',
                  },
                ],
                style: {
                  top: '0.15',
                  fontSize: '18',
                  fontWeight: '400',
                  width: '0.5',
                  height: '0.03',
                },
              },
              {
                type: 'textField',
                placeholder: '.Global.currentUser.vertex.name.lastName',
                dataKey: 'formData.vertex.name.firstName',
                style: {
                  top: '0.15',
                  left: '0.28',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.5',
                  height: '0.03',
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
                    text: 'Username:',
                  },
                  {
                    text: '*',
                    color: '0xD53C42',
                  },
                ],
                style: {
                  top: '0.25',
                  fontSize: '18',
                  fontWeight: '400',
                  width: '0.2',
                  height: '0.03',
                },
              },
              {
                type: 'textField',
                placeholder: '.Global.currentUser.vertex.name.userName',
                dataKey: '.Global.currentUser.vertex.name.userName',
                style: {
                  top: '0.25',
                  left: '0.28',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.5',
                  height: '0.03',
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
                    text: 'Phone Number:',
                  },
                  {
                    text: '*',
                    color: '0xD53C42',
                  },
                ],
                style: {
                  top: '0.35',
                  fontSize: '18',
                  fontWeight: '400',
                  width: '0.25',
                  height: '0.03',
                },
              },
              {
                type: 'textField',
                placeholder: '.Global.currentUser.vertex.uid',
                dataKey: '.Global.currentUser.vertex.name.phone',
                style: {
                  top: '0.35',
                  left: '0.28',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.5',
                  height: '0.03',
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
                    text: 'Password:',
                  },
                  {
                    text: '*',
                    color: '0xD53C42',
                  },
                ],
                style: {
                  top: '0.45',
                  fontSize: '18',
                  fontWeight: '400',
                  width: '0.25',
                  height: '0.03',
                },
              },
              {
                type: 'textField',
                dataKey: '.Global.currentUser.vertex.name.password',
                style: {
                  top: '0.45',
                  left: '0.28',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.5',
                  height: '0.03',
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
            type: 'button',
            text: 'Save',
            onClick: [
              {
                actionType: 'evalObject',
                object: {
                  if: [
                    true,
                    {
                      actionType: 'evalObject',
                      object: [
                        {
                          actionType: 'popUp',
                          popUpView: 'inputVerificationCode',
                          wait: true,
                        },
                      ],
                    },
                  ],
                },
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
