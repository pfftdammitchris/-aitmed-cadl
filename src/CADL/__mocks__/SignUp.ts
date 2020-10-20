export default {
  CreateNewAccount: {
    module: 'patient',
    title: 'Create New Account',
    pageNumber: '45',
    formData: {
      vertex: {
        '.Vertex': '',
        type: '1',
        name: {
          countryCode: '.SignUp.formData.countryCode',
          phoneNumber: '.SignUp.formData.phoneNumber',
          userName: '',
          email: '',
          password: '',
          confirmPassword: '',
          avatar: 'https://public.aitmed.com/avatar/JohnDoe.jpg',
          signature: '',
          verificationCode: '',
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
      tar: 'selectOff.png',
    },
    verificationCode: {
      response: '',
      edge: {
        '.Edge': '',
        type: 1010,
        name: {
          phone_number: '=..apiData.phoneNumber',
        },
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataIn: 'verificationCode.edge',
          dataOut: 'verificationCode.response',
        },
      },
    },
    init: [
      {
        if: [
          '.ServicesAgreement.agreement.servicesAgreement',
          {
            '..formData.tar@': 'selectOn.png',
          },
          {
            '..formData.tar@': 'selectOff.png',
          },
        ],
      },
    ],
    save: [
      {
        '=.builtIn.string.concat': {
          dataIn: [
            '=.CreateNewAccount.formData.vertex.name.countryCode',
            ' ',
            '=.CreateNewAccount.formData.vertex.name.phoneNumber',
          ],
          dataOut: 'CreateNewAccount.apiData.phoneNumber',
        },
      },
      {
        '=.SignIn.verificationCode.edgeAPI.store': '',
      },
    ],
    check: [
      {
        if: [
          '..loginNewDevice.response.code',
          {
            actionType: 'popUp',
            '.Global.popUpMessage@': '=..loginNewDevice.response.error',
            popUpView: 'inputVerificationCode',
          },
          'continue',
        ],
      },
    ],
    update: [
      {
        '=.SignIn.loginUser.edgeAPI.store': '',
      },
      {
        '=.SignIn.retrieveVertex.vertexAPI.get': '',
      },
      {
        '.Global.currentUser.vertex@': '=..retrieveVertex.response.vertex.0',
      },
      {
        '.Global.currentUser.JWT@': '=..loginUser.response.jwt',
      },
      {
        '=.builtIn.storeCredentials': {
          dataIn: {
            sk: '=.Global.currentUser.vertex.sk',
            pk: '=.Global.currentUser.vertex.pk',
            userId: '=.Global.currentUser.vertex.id',
            esk: '=.Global.currentUser.vertex.esk',
          },
        },
      },
      {
        '.Global.currentUser.dataCache.loadingDateTime@':
          '=.Global.currentDateTime',
      },
      {
        '=.Global.rootNotebook.edgeAPI.get': '',
      },
      {
        '.Global.rootNotebook.response.edge@':
          '=.Global.rootNotebook.response.edge.0',
      },

      {
        '.Global.currentUser.dataCache.loadingDateTime@':
          '=.Global.currentDateTime',
      },
      {
        if: [
          '=.Global.rootNotebook.response.edge.id',
          'continue',
          '=.Global.rootNotebook.edgeAPI.store',
        ],
      },
      {
        if: [
          '=.Global.shareNotebook.edge.id',
          'continue',
          '=.Global.shareNotebook.edgeAPI.store',
        ],
      },
    ],
    apiData: {
      phoneNumber: '',
    },
    components: [
      {
        type: 'view',
        style: {
          left: '0',
          top: '0',
          width: '1',
          height: '1.2',
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
              top: '0.3',
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
              top: '0.35',
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
                options: '.CountryCode',
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
              top: '0.35',
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
                type: 'label',
                dataKey: 'formData.vertex.name.phoneNumber',
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
            type: 'view',
            style: {
              top: '0.45',
              left: '0.121',
              width: '0.9',
            },
            children: [
              {
                type: 'label',
                text: 'username',
                style: {
                  color: '0x000000',
                  left: '0',
                  top: '0.01',
                  width: '0.2',
                  height: '0.041',
                  fontSize: '12',
                  textAlign: {
                    x: 'left',
                  },
                },
              },
              {
                type: 'textField',
                contentType: 'text',
                placeholder: 'please enter username',
                dataKey: 'formData.vertex.name.userName',
                required: 'true',
                style: {
                  fontSize: '14',
                  left: '0',
                  backgroundColor: '0xffffff',
                  top: '0.05',
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
            ],
          },
          {
            type: 'view',
            style: {
              top: '0.55',
              left: '0.121',
              width: '0.9',
            },
            children: [
              {
                type: 'label',
                text: 'email',
                style: {
                  color: '0x000000',
                  left: '0',
                  top: '0.01',
                  width: '0.2',
                  height: '0.041',
                  fontSize: '12',
                  textAlign: {
                    x: 'left',
                  },
                },
              },
              {
                type: 'textField',
                contentType: 'text',
                placeholder: 'username@aitmed.com',
                dataKey: 'formData.vertex.name.email',
                required: 'true',
                style: {
                  fontSize: '14',
                  left: '0',
                  backgroundColor: '0xffffff',
                  top: '0.05',
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
            ],
          },
          {
            type: 'view',
            style: {
              top: '0.65',
              left: '0.121',
              width: '0.9',
            },
            children: [
              {
                type: 'label',
                text: 'New Password',
                style: {
                  color: '0x000000',
                  left: '0',
                  top: '0.01',
                  width: '0.5',
                  height: '0.041',
                  fontSize: '12',
                  textAlign: {
                    x: 'left',
                  },
                },
              },
              {
                type: 'textField',
                contentType: 'password',
                placeholder: '..formData.vertex.name.password',
                dataKey: 'formData.vertex.name.password',
                required: 'true',
                style: {
                  fontSize: '14',
                  left: '0',
                  top: '0.05',
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
            ],
          },
          {
            type: 'view',
            style: {
              top: '0.75',
              left: '0.121',
              width: '0.9',
            },
            children: [
              {
                type: 'label',
                text: 'Confirm Password',
                style: {
                  color: '0x000000',
                  left: '0',
                  top: '0.01',
                  width: '0.5',
                  height: '0.041',
                  fontSize: '12',
                  textAlign: {
                    x: 'left',
                  },
                },
              },
              {
                type: 'textField',
                contentType: 'password',
                placeholder: '..formData.vertex.name.confirmPassword',
                dataKey: 'formData.vertex.name.confirmPassword',
                required: 'true',
                style: {
                  fontSize: '14',
                  left: '0',
                  top: '0.05',
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
            ],
          },
          {
            type: 'view',
            style: {
              top: '0.88',
              left: '0.1',
              width: '0.9',
            },
            children: [
              {
                type: 'image',
                viewTag: 'select',
                onClick: [
                  {
                    actionType: 'builtIn',
                    funcName: 'toggleSelectOnOff',
                  },
                ],
                path: 'selectOff.png',
                pathSelected: 'selectOn.png',
                style: {
                  left: '0',
                  width: '0.05',
                },
              },
              {
                type: 'label',
                style: {
                  color: '0x000000',
                  left: '0.05',
                  fontSize: '12',
                  textAlign: {
                    x: 'left',
                  },
                },
                onClick: [
                  {
                    goto: 'UserAgreement',
                  },
                ],
                textBoard: [
                  {
                    text: 'I agree to',
                  },
                  {
                    text: 'Aitmed Trems of Use Agreement',
                    color: '0x69AAD8',
                  },
                  {
                    text: 'and',
                  },
                ],
              },
              {
                type: 'label',
                style: {
                  color: '0x000000',
                  left: '0.05',
                  top: '0.03',
                  fontSize: '12',
                  textAlign: {
                    x: 'left',
                  },
                },
                onClick: [
                  {
                    goto: 'PrivacyPolicy',
                  },
                ],
                textBoard: [
                  {
                    text: 'AiTmed Privacy Policy',
                    color: '0x69AAD8',
                  },
                ],
              },
              {
                type: 'image',
                path: '..formData.tar',
                style: {
                  left: '0',
                  width: '0.05',
                  top: '0.07',
                },
              },
              {
                type: 'label',
                textBoard: [
                  {
                    text: 'I also agree to',
                  },
                  {
                    text: 'MASTER SUBSCRIPTION AND SERVICES AGREEMENT',
                    color: '0x69aad8',
                  },
                ],
                onClick: [
                  {
                    goto: 'ServicesAgreement',
                  },
                ],
                style: {
                  color: '0x000000',
                  left: '0.05',
                  top: '0.07',
                  fontSize: '12',
                  textAlign: {
                    x: 'left',
                  },
                },
              },
            ],
          },
          {
            type: 'button',
            text: 'Sign Up',
            style: {
              color: '0xffffffff',
              fontSize: '16',
              left: '0.134',
              top: '1.02',
              fontWeight: 400,
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
                actionType: 'evalObject',
                object: '..save',
              },
              {
                actionType: 'popUp',
                popUpView: 'inputVerificationCode',
              },
            ],
          },
          {
            type: 'popUp',
            viewTag: 'inputVerificationCode',
            style: {
              left: '0',
              top: '0',
              width: '1',
              height: '1',
              backgroundColor: '0x00000066',
            },
            children: [
              {
                type: 'view',
                style: {
                  left: '0.05',
                  top: '0.15',
                  width: '0.89333',
                  height: '0.35',
                  backgroundColor: '0xeeeeeeff',
                  border: {
                    style: '5',
                  },
                  borderRadius: '15',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Enter the 6-digit verification code',
                    style: {
                      '.LabelStyle': {
                        left: '0',
                        top: '0.05',
                        width: '0.89333',
                        height: '0.05',
                        color: '0x00000088',
                        fontSize: '20',
                        fontStyle: 'bold',
                        display: 'inline',
                        textAlign: {
                          x: 'center',
                          y: 'center',
                        },
                      },
                    },
                  },
                  {
                    type: 'textField',
                    contentType: 'text',
                    dataKey: 'formData.code',
                    required: 'true',
                    style: {
                      '.LabelStyle': {
                        left: '0',
                        top: '0.13',
                        width: '0.89333',
                        height: '0.05',
                        color: '0x00000088',
                        fontSize: '20',
                        display: 'inline',
                        textAlign: {
                          x: 'center',
                          y: 'center',
                        },
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'Global.popUpMessage',
                    style: {
                      '.LabelStyle': {
                        left: '0',
                        top: '0.20',
                        width: '0.89333',
                        height: '0.05',
                        color: '0x00000088',
                        fontSize: '20',
                        fontStyle: 'bold',
                        display: 'inline',
                        textAlign: {
                          x: 'center',
                          y: 'center',
                        },
                      },
                    },
                  },
                  {
                    type: 'divider',
                    style: {
                      '.DividerStyle': {
                        left: '0',
                        top: '0.25436',
                        width: '0.89333',
                        height: '0.001',
                        backgroundColor: '0x00000088',
                      },
                    },
                  },
                  {
                    type: 'button',
                    onClick: [
                      {
                        actionType: 'popUpDismiss',
                        popUpView: 'inputVerificationCode',
                      },
                    ],
                    text: 'CANCEL',
                    style: {
                      '.LabelStyle': {
                        left: '0',
                        top: '0.275',
                        width: '0.42',
                        height: '0.06812',
                        color: '0x007affff',
                        fontSize: '17',
                        display: 'inline',
                        textAlign: {
                          x: 'center',
                          y: 'center',
                        },
                        border: {
                          style: '5',
                          borderRadius: '15',
                        },
                      },
                    },
                  },
                  {
                    type: 'button',
                    onClick: [
                      {
                        actionType: 'popUpDismiss',
                        popUpView: 'inputVerificationCode',
                      },
                      {
                        actionType: 'evalObject',
                        object: '..check',
                      },
                      {
                        actionType: 'evalObject',
                        object: {
                          '=.builtIn.eccNaCl.decryptAES': {
                            dataIn: {
                              key: '=..formData.password',
                              message:
                                '=..loginNewDevice.response.edge.deat.esk',
                            },
                            dataOut: 'SignUp.formData.sk',
                          },
                        },
                      },
                      {
                        actionType: 'evalObject',
                        object: {
                          '=.builtIn.eccNaCl.skCheck': {
                            dataIn: {
                              pk: '=..loginNewDevice.response.edge.deat.pk',
                              sk: '=..formData.sk',
                            },
                            dataOut: 'formData.pass',
                          },
                        },
                      },

                      {
                        actionType: 'evalObject',
                        object: [
                          {
                            if: [
                              '..formData.pass',
                              {
                                '.Global.currentUser.vertex.sk@':
                                  '=..formData.sk',
                              },
                              {
                                actionType: 'popUp',
                                '.Global.popUpMessage@':
                                  'please re-input password',
                                popUpView: 'BaseCheckView',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        actionType: 'evalObject',
                        object: '..update',
                      },
                      {
                        actionType: 'evalObject',
                        object: [
                          {
                            if: [
                              '=.Global.currentUser.vertex.sk',
                              {
                                goto: 'MeetingRoomInvited',
                              },
                              'continue',
                            ],
                          },
                        ],
                      },
                    ],
                    text: 'SUBMIT',
                    style: {
                      '.LabelStyle': {
                        left: '0.45',
                        top: '0.275',
                        width: '0.42',
                        height: '0.06812',
                        color: '0x007affff',
                        fontSize: '17',
                        display: 'inline',
                        textAlign: {
                          x: 'center',
                          y: 'center',
                        },
                        border: {
                          style: '5',
                          borderRadius: '15',
                        },
                      },
                    },
                  },
                  {
                    type: 'divider',
                    style: {
                      '.DividerStyle': {
                        left: '0.45',
                        top: '0.26',
                        width: '0.001',
                        height: '0.07',
                        backgroundColor: '0x00000088',
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'view',
            style: {
              left: '0',
              top: '1.08',
              width: '1',
              height: '0.054',
            },
            children: [
              {
                type: 'label',
                text: 'Already have an account?',
                style: {
                  color: '0x00000088',
                  fontSize: '14',
                  left: '0.1',
                  top: '0',
                  width: '0.6',
                  height: '0.08',
                  textAlign: {
                    x: 'right',
                    y: 'center',
                  },
                },
              },
              {
                type: 'label',
                text: 'Sign In',
                style: {
                  color: '0x3185c7ff',
                  fontSize: '14',
                  fontStyle: 'bold',
                  left: '0.7',
                  top: '0',
                  fontWeight: 400,
                  width: '0.25',
                  height: '0.08',
                  backgroundColor: '0xffffffff',
                  border: {
                    style: '1',
                  },
                  textAlign: {
                    y: 'center',
                  },
                },
                onClick: [
                  {
                    goto: 'SignIn',
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
