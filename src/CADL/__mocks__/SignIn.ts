export default {
  SignIn: {
    module: 'meetingRoom',
    pageNumber: '3',
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
        '=.builtIn.string.concat': {
          dataIn: [
            '=.SignIn.formData.countryCode',
            ' ',
            '=.SignIn.formData.phoneNumber',
          ],
          dataOut: 'SignIn.apiData.phoneNumber',
        },
      },
      {
        '=.SignIn.verificationCode.edgeAPI.store': '',
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
            'popUpMessage@': '=..loginNewDevice.response.error',
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
        '.Global.currentUser.vertex@': '=..retrieveVertex.response.vertex[0]',
      },
      {
        '.Global.currentUser.JWT@': '=..loginUser.response.jwt',
      },
      {
        '=.Global.contactList.get': '',
      },
      {
        '.Global.contactList.dataCache.loadingDateTime@':
          '=.Global.currentDateTime',
      },
      {
        '.Global.currentUser.dataCache.loadingDateTime@':
          '=.Global.currentDateTime',
      },
    ],
    formData: {
      countryCode: '+1',
      phoneNumber: '000-000-0002',
      password: 'password',
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
        type: 'view',
        style: {
          left: '0',
          top: '0',
          width: '1',
          height: '1',
        },
        children: [
          '.LogoSign',
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
                placeholder: '..formData.phoneNumber',
                dataKey: 'formData.phoneNumber',
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
            placeholder: '..formData.password',
            dataKey: 'formData.password',
            required: 'true',
            style: {
              textAlign: {
                x: 'left',
              },
              fontSize: '14',
              left: '0.134',
              top: '0.554',
              width: '0.747',
              height: '0.041',
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
              top: '0.6',
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
            viewTag: 'okView',
            style: {
              left: '0',
              top: '0',
              width: '1',
              height: '1',
              backgroundColor: '0x00000066',
            },
            children: [
              {
                type: 'label',
                text: 'Please re-input the password',
                style: {
                  '.LabelStyle': {
                    left: '0',
                    top: '0.04',
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
                    popUpView: 'okView',
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
                    },
                    borderRadius: '15',
                  },
                },
              },
              {
                type: 'button',
                onClick: [
                  {
                    actionType: 'popUpDismiss',
                    popUpView: 'okView',
                  },
                ],
                text: 'OK',
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
                    },
                    borderRadius: '15',
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
                        top: '0.04',
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
                        },
                        borderRadius: '15',
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
                                popUpView: 'okView',
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
                        actionType: 'pageJump',
                        destination: 'MeetingRoomInvited',
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
                        },
                        borderRadius: '15',
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
                  '.LabelStyle': {
                    color: '0x00000088',
                    fontSize: '14',
                    left: '0',
                    top: '0',
                    width: '0.4',
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
                text: 'Sign Up',
                style: {
                  color: '0x3185c7ff',
                  fontSize: '14',
                  fontStyle: 'bold',
                  left: '0.41',
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
                    destination: 'SignUp',
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
