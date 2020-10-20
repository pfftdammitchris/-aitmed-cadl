export default {
  CreateNewAccount: {
    module: 'patient',
    title: 'Create New Account',
    pageNumber: '45',
    save: ['..formData.vertexAPI.store', '.Global.rootNotebook.edgeAPI.store'],
    update: {
      '.Global.currentUser.vertex@': '=..formData.vertex.vertex',
      '.Global.currentUser.JWT@': '=..formData.vertex.jwt',
      '=.Global.rootNotebook.edgeAPI.get': '',
      '.Global.rootNotebook.response.edge@':
        '=.Global.rootNotebook.response.edge.0',
      '.Global.currentUser.dataCache.loadingDateTime@':
        '=.Global.currentDateTime',
    },
    formData: {
      vertex: {
        '.Vertex': '',
        type: '1',
        name: {
          countryCode: '.SignUp.formData.countryCode',
          phoneNumber: '.SignUp.formData.phoneNumber',
          userName: '',
          password: '',
          confirmPassword: '',
          verificationCode: '.SignUp.formData.code',
          avatar: 'https://public.aitmed.com/avatar/JohnDoe.jpg',
        },
      },
      vertexAPI: {
        '.VertexAPI': '',
        store: {
          api: 'builtIn.createNewAccount',
          dataKey: 'formData.vertex',
        },
      },
      JWT: '=.Global.currentUser.JWT',
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
            type: 'image',
            path: 'aitmedLogo.png',
            style: {
              left: '0.1',
              top: '0.1',
              width: '0.32',
              height: '0.17',
            },
          },
          {
            type: 'label',
            text: 'Create New Account with AiTmed',
            style: {
              color: '0x3185c7ff',
              left: '0.147',
              top: '0.357',
              width: '0.72',
              height: '0.041',
              fontSize: '16',
              fontStyle: 'bold',
              display: 'inline',
              textAlign: {
                x: 'center',
                y: 'center',
              },
            },
          },
          {
            type: 'view',
            style: {
              left: '0.121',
              top: '0.42',
              width: '0.2',
              height: '0.09',
            },
            children: [
              {
                type: 'label',
                text: 'Country',
                style: {
                  color: '0x00000058',
                  left: '0',
                  top: '0',
                  width: '0.2',
                  height: '0.041',
                  fontSize: '12',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'select',
                contentType: 'countryCode',
                placeholder: '..formData.vertex.name.countryCode',
                dataKey: 'formData.vertex.name.countryCode',
                options: ['+1'],
                required: 'true',
                style: {
                  left: '0',
                  top: '0.045',
                  width: '0.2',
                  height: '0.041',
                  fontSize: '14',
                  placeholder: 'US +1',
                  borderWidth: '1',
                  border: {
                    style: '2',
                    color: '0x00000058',
                  },
                },
              },
            ],
          },
          {
            type: 'view',
            style: {
              left: '0.3333',
              top: '0.42',
              width: '0.61333',
              height: '0.09',
            },
            children: [
              {
                type: 'label',
                text: 'Phone',
                style: {
                  color: '0x00000058',
                  left: '0',
                  top: '0',
                  width: '0.2',
                  height: '0.041',
                  fontSize: '12',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'textField',
                contentType: 'phoneNumber',
                placeholder: '..formData.vertex.name.phoneNumber',
                dataKey: 'formData.vertex.name.phoneNumber',
                required: 'true',
                style: {
                  fontSize: '14',
                  left: '0',
                  top: '0.045',
                  width: '0.54667',
                  height: '0.041',
                  borderWidth: '1',
                  border: {
                    style: '2',
                  },
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
            ],
          },
          {
            type: 'textField',
            contentType: 'text',
            placeholder: 'userName',
            dataKey: 'formData.vertex.name.userName',
            required: 'true',
            style: {
              fontSize: '14',
              left: '0.134',
              top: '0.5313',
              width: '0.747',
              height: '0.041',
              borderWidth: '1',
              border: {
                style: '2',
              },
              textAlign: {
                x: 'left',
                y: 'center',
              },
            },
          },
          {
            type: 'textField',
            contentType: 'password',
            placeholder: 'password',
            dataKey: 'formData.vertex.name.password',
            required: 'true',
            style: {
              fontSize: '14',
              left: '0.134',
              top: '0.5994',
              width: '0.747',
              height: '0.041',
              borderWidth: '1',
              border: {
                style: '2',
              },
              textAlign: {
                x: 'left',
                y: 'center',
              },
            },
          },
          {
            type: 'textField',
            contentType: 'password',
            placeholder: 'confirmPassword',
            dataKey: 'formData.vertex.name.confirmPassword',
            required: 'true',
            style: {
              fontSize: '14',
              left: '0.134',
              top: '0.66757',
              width: '0.747',
              height: '0.041',
              borderWidth: '1',
              border: {
                style: '2',
              },
              textAlign: {
                x: 'left',
                y: 'center',
              },
            },
          },
          {
            type: 'button',
            text: 'Sign Up',
            style: {
              color: '0xffffffff',
              fontSize: '16',
              fontStyle: 'bold',
              left: '0.134',
              top: '0.75',
              width: '0.747',
              height: '0.06',
              backgroundColor: '0x388eccff',
              border: {
                style: '1',
              },
              display: 'inline',
              textAlign: {
                x: 'center',
                y: 'center',
              },
            },
            onClick: [
              {
                actionType: 'builtIn',
                funcName: 'stringCompare',
                object: [
                  '..formData.vertex.name.password',
                  '..formData.vertex.name.confirmPassword',
                ],
              },
              {
                actionType: 'saveObject',
                object: '..save',
              },
              {
                actionType: 'evalObject',
                object: '..update',
              },
              {
                goto: 'MeetingRoomInvited',
              },
            ],
          },
          {
            type: 'view',
            style: {
              left: '0',
              top: '0.89',
              width: '1',
              height: '0.054',
            },
            children: [
              {
                type: 'label',
                text: 'Already have an account?',
                style: {
                  '.LabelStyle': {
                    color: '0x00000088',
                    fontSize: '14',
                    left: '0',
                    top: '0',
                    width: '0.6',
                    height: '0.054',
                    display: 'inline',
                    textAlign: {
                      x: 'right',
                      y: 'center',
                    },
                  },
                },
              },
              {
                type: 'button',
                text: 'Sign In',
                style: {
                  color: '0x3185c7ff',
                  fontSize: '14',
                  fontStyle: 'bold',
                  left: '0.61',
                  top: '0',
                  width: '0.25',
                  height: '0.054',
                  backgroundColor: '0xffffffff',
                  border: {
                    style: '1',
                  },
                },
                onClick: [
                  {
                    actionType: 'pageJump',
                    destination: 'SignIn',
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