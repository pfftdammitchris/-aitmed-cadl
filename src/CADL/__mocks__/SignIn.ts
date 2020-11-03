export default {
  SignIn: {
    pageNumber: '30',
    init: [
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
    save: [
      {
        actionType: 'evalObject',
        object: {
          '=.builtIn.eccNaCl.decryptAES': {
            dataIn: {
              key: '=..formData.password',
              message: '=.Global.currentUser.vertex.esk',
            },
            dataOut: 'SignIn.formData.sk',
          },
        },
      },
      {
        actionType: 'evalObject',
        object: {
          '=.builtIn.eccNaCl.skCheck': {
            dataIn: {
              pk: '=.Global.currentUser.vertex.pk',
              sk: '=..formData.sk',
            },
            dataOut: 'SignIn.formData.pass',
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
                '.Global.currentUser.vertex.sk@': '=..formData.sk',
              },
              {
                actionType: 'popUp',
                '.Global.popUpMessage@': 'please re-input password',
                popUpView: 'BaseCheckView',
              },
            ],
          },
        ],
      },
    ],
    check: [
      {
        '=.SignIn.loginNewDevice.edgeAPI.store': '',
      },
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
        '.Global.rootNotebookID@': '=.Global.currentUser.vertex.deat.rnb64ID',
      },
      {
        '.Global.currentUser.dataCache.loadingDateTime@':
          '=.Global.currentDateTime',
      },
      {
        if: [
          '=.Global.shareNotebook.edge.id',
          'continue',
          '=.Global.shareNotebook.edgeAPI.store',
        ],
      },
    ],
    formData: {
      countryCode: '+1',
      phoneNumber: '',
      password: '',
      code: '',
      sk: '',
      pass: '',
    },
    retrieveVertex: {
      response: '',
      vertex: {
        '.Vertex': '',
        id: '=..loginNewDevice.response.edge.deat.user_id',
      },
      vertexAPI: {
        get: {
          api: 'rv',
          dataIn: 'retrieveVertex.vertex',
          dataOut: 'retrieveVertex.response',
        },
      },
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
    loginNewDevice: {
      response: '',
      edge: {
        '.Edge': '',
        type: 1040,
        name: {
          phone_number: '=..apiData.phoneNumber',
          verification_code: '=..formData.code',
        },
        deat: {
          UserId: '',
          Pk: '',
          Esk: '',
        },
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataIn: 'loginNewDevice.edge',
          dataOut: 'loginNewDevice.response',
        },
      },
    },
    loginUser: {
      response: '',
      edge: {
        '.Edge': '',
        type: 1030,
        bvid: '=..loginNewDevice.response.edge.deat.user_id',
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataIn: 'loginUser.edge',
          dataOut: 'loginUser.response',
        },
      },
    },
    apiData: {
      phoneNumber: '',
    },
    components: [
      {
        '.BaseCheckView': null,
      },
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
              top: '0.05',
              width: '0.25',
            },
          },
          {
            type: 'label',
            text: 'Welcome back',
            style: {
              color: '0x000000ff',
              left: '0.147',
              top: '0.28',
              width: '0.72',
              height: '0.041',
              fontSize: '24',
              fontStyle: 'bold',
              display: 'inline',
              textAlign: {
                x: 'left',
                y: 'center',
              },
            },
          },
          {
            type: 'label',
            text: 'sign in to continue',
            style: {
              color: '0x00000058',
              left: '0.147',
              top: '0.33',
              width: '0.72',
              height: '0.041',
              fontSize: '16',
              fontStyle: 'bold',
              display: 'inline',
              textAlign: {
                x: 'left',
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
                placeholder: '..formData.countryCode',
                dataKey: 'formData.countryCode',
                options: ['+1', '+52', '+86', '+965'],
                required: 'true',
                style: {
                  left: '0',
                  top: '0.045',
                  width: '0.2',
                  height: '0.041',
                  fontSize: '14',
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
                  width: '0.483',
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
                placeholder: 'your phone number',
                dataKey: 'formData.phoneNumber',
                required: 'true',
                style: {
                  textAlign: {
                    x: 'left',
                  },
                  fontSize: '14',
                  left: '0',
                  top: '0.045',
                  width: '0.54667',
                  height: '0.041',
                  required: 'true',
                  borderWidth: '1',
                  border: {
                    style: '2',
                  },
                },
              },
            ],
          },
          {
            type: 'textField',
            contentType: 'password',
            placeholder: 'your password',
            dataKey: 'formData.password',
            required: 'true',
            style: {
              textAlign: {
                x: 'left',
              },
              fontSize: '14',
              left: '0.121',
              top: '0.554',
              width: '0.76',
              height: '0.041',
              backgroundColor: '0x388ecc00',
              borderWidth: '1',
              border: {
                style: '2',
              },
            },
          },
          {
            type: 'label',
            text: 'Forgot Password?',
            style: {
              color: '0x00000058',
              left: '0.134',
              top: '0.62',
              width: '0.747',
              height: '0.041',
              fontSize: '14',
              fontStyle: 'bold',
              display: 'inline',
              textAlign: {
                x: 'right',
                y: 'center',
              },
            },
          },
          {
            type: 'button',
            text: 'Sign In',
            style: {
              color: '0xffffffff',
              fontSize: '16',
              fontStyle: 'bold',
              left: '0.134',
              top: '0.7',
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
                object: {
                  '=.builtIn.string.concat': {
                    dataIn: [
                      '=.SignIn.formData.countryCode',
                      ' ',
                      '=.SignIn.formData.phoneNumber',
                    ],
                    dataOut: 'SignIn.apiData.phoneNumber',
                  },
                },
              },
              {
                actionType: 'evalObject',
                object: [
                  {
                    if: [
                      '=.Global.currentUser.vertex.esk',
                      {
                        actionType: 'evalObject',
                        object: {},
                      },
                      'continue',
                    ],
                  },
                ],
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
              {
                actionType: 'evalObject',
                object: [
                  {
                    '=.SignIn.verificationCode.edgeAPI.store': '',
                  },
                ],
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
                  top: '0.3',
                  width: '0.89333',
                  height: '0.35',
                  zIndex: '100',
                  backgroundColor: '0xeaeaea',
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
                        top: '0.08',
                        width: '0.89333',
                        height: '0.05',
                        color: '0x000000',
                        fontSize: '19',
                        display: 'inline',
                        fontFamily: 'sans-serif',
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
                        left: '0.02',
                        top: '0.15',
                        width: '0.84',
                        height: '0.05',
                        color: '0x00000088',
                        fontSize: '20',
                        display: 'inline',
                        border: {
                          style: '3',
                          color: '0xb5b5b8',
                        },
                        borderWidth: '1',
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
                        fontSize: '19',
                        display: 'inline',
                        backgroundColor: '0xeeeeee',
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
                            dataOut: 'SignIn.formData.sk',
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
                        fontSize: '19',
                        display: 'inline',
                        backgroundColor: '0xeeeeee',
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
                        top: '0.255',
                        width: '0.001',
                        height: '0.08',
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
              left: '0.134',
              top: '0.89',
              width: '0.752',
              height: '0.054',
            },
            children: [
              {
                type: 'label',
                text: 'New user?',
                style: {
                  color: '0xb1b1b1',
                  fontSize: '15',
                  left: '0.2',
                  top: '0',
                  width: '0.4',
                  height: '0.054',
                  textAlign: {
                    x: 'center',
                    y: 'center',
                  },
                },
              },
              {
                type: 'button',
                text: 'Sign Up',
                style: {
                  color: '0x3185c7ff',
                  fontSize: '15',
                  fontStyle: 'bold',
                  left: '0.41',
                  top: '0',
                  width: '0.25',
                  height: '0.054',
                  backgroundColor: '0xffffff00',
                  border: {
                    style: '1',
                  },
                },
                onClick: [
                  {
                    goto: 'SignUp',
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
