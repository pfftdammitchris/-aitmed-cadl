export default {
  SignIn: {
    pageNumber: '30',
    init: [
      {
        if: [
          '.builtIn.isIOS',
          {
            actionType: 'evalObject',
            object: '..setIOS',
          },
          'continue',
        ],
      },
      {
        if: [
          '.builtIn.isAndroid',
          {
            actionType: 'evalObject',
            object: '..setAndroid',
          },
          'continue',
        ],
      },
      {
        if: [
          '=..appLink.url',
          {
            goto: '..appLink.url',
          },
          'continue',
        ],
      },
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
    setIOS: [
      {
        '..appLink.url@': 'https://apps.apple.com/us/app/aitmeet/id1539500231',
      },
      {
        '..appLink.img@': 'https://public.aitmed.com/commonRes/appstore.png',
      },
    ],
    setAndroid: [
      {
        '..appLink.url@':
          'https://play.google.com/store/apps/details?id=com.aitmed.ameet',
      },
      {
        '..appLink.img@': 'https://public.aitmed.com/commonRes/google-play.png',
      },
    ],
    appLink: {
      url: '',
      img: '',
    },
    save: [
      {
        '=.builtIn.eccNaCl.decryptAES': {
          dataIn: {
            key: '=..formData.password',
            message: '=.Global.currentUser.vertex.esk',
          },
          dataOut: 'SignIn.formData.sk',
        },
      },
      {
        '=.builtIn.eccNaCl.skCheck': {
          dataIn: {
            pk: '=.Global.currentUser.vertex.pk',
            sk: '=..formData.sk',
          },
          dataOut: 'SignIn.formData.pass',
        },
      },
      {
        if: [
          '=..formData.pass',
          {
            '.Global.currentUser.vertex.sk@': '=..formData.sk',
          },
          {
            actionType: 'popUp',
            popUpView: 'wrongPassword',
            wait: true,
          },
        ],
      },
      {
        if: [
          {
            '=.builtIn.string.equal': {
              dataIn: {
                string1: '=.SignIn.formData.phoneNumber',
                string2: '=.Global.phoneNumber',
              },
            },
          },
          'continue',
          {
            '.Global.currentUser.vertex.sk@': '',
          },
        ],
      },
    ],
    check: [
      {
        '=.SignIn.loginNewDevice.edgeAPI.store': '',
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
        if: [
          {
            '=.builtIn.string.equal': {
              dataIn: {
                string1: '=..loginNewDevice.response.code',
                string2: 1020,
              },
            },
          },
          {
            actionType: 'popUp',
            popUpView: 'userCannotfind',
            wait: true,
          },
          'continue',
        ],
      },
      {
        if: [
          {
            '=.builtIn.string.equal': {
              dataIn: {
                string1: '=..loginNewDevice.response.code',
                string2: 0,
              },
            },
          },
          'continue',
          {
            actionType: 'popUp',
            popUpView: 'wrongCode',
            wait: true,
          },
        ],
      },
    ],
    checkPk: [
      {
        if: [
          '=.Global.currentUser.vertex.pk',
          'continue',
          {
            goto: 'SignUp',
          },
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
        '.Global.phoneNumber@': '=..formData.phoneNumber',
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
    ],
    formData: {
      checkOk: 'false',
      checkMessage: 'no message',
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
          dataIn: 'SignIn.retrieveVertex.vertex',
          dataOut: 'SignIn.retrieveVertex.response',
        },
      },
    },
    verificationCode: {
      response: '',
      edge: {
        '.Edge': '',
        type: 1010,
        _nonce: '=.Global._nonce',
        name: {
          phone_number: '=..apiData.phoneNumber',
        },
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataIn: 'SignIn.verificationCode.edge',
          dataOut: 'SignIn.verificationCode.response',
        },
      },
    },
    loginNewDevice: {
      response: '',
      edge: {
        '.Edge': '',
        type: 1040,
        _nonce: '=.Global._nonce',
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
          dataIn: 'SignIn.loginNewDevice.edge',
          dataOut: 'SignIn.loginNewDevice.response',
        },
      },
    },
    loginUser: {
      response: '',
      edge: {
        '.Edge': '',
        type: 1030,
        _nonce: '=.Global._nonce',
        bvid: '=..loginNewDevice.response.edge.deat.user_id',
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataIn: 'SignIn.loginUser.edge',
          dataOut: 'SignIn.loginUser.response',
        },
      },
    },
    apiData: {
      phoneNumber: '',
    },
    initFocus: 'phoneNumberVT',
    components: [
      {
        '.BaseCheckView': '',
        message: 'Incorrect Password',
        viewTag: 'wrongPassword',
      },
      {
        '.BaseCheckView': '',
        message: 'Incorrect verificationCode',
        viewTag: 'wrongCode',
      },
      {
        '.BaseCheckView': '',
        message: 'Cannot Find the User',
        viewTag: 'userCannotfind',
      },
      {
        type: 'view',
        style: {
          left: '0',
          top: '0',
          width: '1',
          height: '1',
          position: 'fixed',
        },
        children: [
          {
            type: 'image',
            path: 'backpic.png',
            style: {
              left: '0',
              width: '1',
              top: '0',
            },
          },
          {
            type: 'image',
            path: '~/assets/mLogo.png',
            style: {
              top: '0.08',
              width: '0.38',
              left: '0.31',
            },
          },
          {
            type: 'view',
            style: {
              top: '0.35',
              height: '0.65',
              width: '1',
              left: '0',
              backgroundColor: '0xffffff',
              border: {
                style: 3,
              },
              borderRadius: '50',
              boxSizing: 'border-box',
            },
            children: [
              {
                type: 'label',
                text: 'Welcome back!',
                style: {
                  color: '0x000000ff',
                  left: '0.147',
                  top: '0.05',
                  width: '0.72',
                  height: '0.041',
                  fontSize: '28',
                  display: 'inline',
                  textAlign: {
                    x: 'left',
                    y: 'center',
                  },
                },
              },
              {
                type: 'label',
                text: 'Sign in to continue',
                style: {
                  color: '0x00000088',
                  left: '0.147',
                  top: '0.1',
                  width: '0.72',
                  height: '0.041',
                  fontSize: '22',
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
                  top: '0.18',
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
                    options: '.CountryCode',
                    required: 'true',
                    style: {
                      left: '0',
                      top: '0.045',
                      width: '0.2',
                      height: '0.041',
                      fontSize: '14',
                      borderWidth: '1',
                      'box-sizing': 'border-box',
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
                  top: '0.18',
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
                    viewTag: 'phoneNumberVT',
                    contentType: 'phoneNumber',
                    placeholder: 'your phone number',
                    dataKey: 'formData.phoneNumber',
                    required: 'true',
                    onChange: [
                      {
                        emit: {
                          actions: [
                            {
                              '=.builtIn.typeCheck.phoneNumber': {
                                dataIn: {
                                  phoneNumber: '=..formData.phoneNumber',
                                  countryCode: '=..formData.countryCode',
                                },
                                dataOut: 'SignIn.formData.checkOk',
                              },
                            },
                            {
                              if: [
                                '=..formData.checkOk',
                                'continue',
                                {
                                  '..formData.checkMessage@':
                                    'Unacceptible phone number format example: 888-999-0000',
                                },
                              ],
                            },
                          ],
                        },
                      },
                    ],
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
                      'box-sizing': 'border-box',
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
                  top: '0.314',
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
                text: 'Forget password?',
                onClick: [
                  {
                    actionType: 'popUp',
                    popUpView: 'resetUser',
                  },
                ],
                style: {
                  color: '0x00000058',
                  left: '0.56',
                  top: '0.38',
                  width: '0.32',
                  height: '0.041',
                  fontSize: '14',
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
                  top: '0.46',
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
                            object: '..save',
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
                          {
                            '=.SignIn.verificationCode.edgeAPI.store': '',
                          },
                        ],
                      },
                    ],
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
                    actionType: 'popUp',
                    popUpView: 'inputVerificationCode',
                  },
                ],
              },
              {
                type: 'image',
                path: '..appLink.img',
                style: {
                  width: '0.3',
                  top: '0.52',
                  left: '0.57',
                  height: '0.07',
                  borderWidth: '0',
                },
                onClick: [
                  {
                    goto: '..appLink.url',
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  left: '0',
                  top: '0.58',
                  width: '1',
                  height: '0.054',
                  backgroundColor: '0xffffff',
                },
                children: [
                  {
                    type: 'label',
                    text: 'New to AiTmed?',
                    style: {
                      color: '0xb1b1b1',
                      fontSize: '15',
                      left: '0.2',
                      top: '0',
                      width: '0.3',
                      height: '0.054',
                      textAlign: {
                        x: 'right',
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
                      left: '0.544',
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
          {
            type: 'popUp',
            viewTag: 'resetUser',
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
                  height: '0.45',
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
                    text: 'Forget your password?',
                    style: {
                      '.LabelStyle': {
                        left: '0',
                        top: '0.02',
                        width: '0.89333',
                        height: '0.05',
                        color: '0x000000',
                        fontSize: '19',
                        display: 'inline',
                        fontStyle: 'bold',
                        fontFamily: 'sans-serif',
                        textAlign: {
                          x: 'center',
                          y: 'center',
                        },
                      },
                    },
                  },
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'When using blockchain technology, there',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'is no way for us at AiTmed to recover',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'your password. It is blockchain-encrypted',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'for your security and privacy.',
                      },
                    ],
                    style: {
                      '.LabelStyle': null,
                      left: '0',
                      top: '0.07',
                      width: '0.89333',
                      height: '0.05',
                      color: '0x000000',
                      fontSize: '16',
                      display: 'inline',
                      fontFamily: 'sans-serif',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'To reset your password, you must ',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'create a new account.',
                      },
                    ],
                    style: {
                      '.LabelStyle': null,
                      left: '0',
                      top: '0.18',
                      width: '0.89333',
                      height: '0.05',
                      color: '0x000000',
                      fontSize: '16',
                      display: 'inline',
                      fontFamily: 'sans-serif',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'THIS WILL RESET YOUR ACCOUNT AND',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'DELETE ANY PREVIOUSLY STORED ',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'INFORMATION',
                      },
                    ],
                    style: {
                      '.LabelStyle': null,
                      left: '0',
                      top: '0.24',
                      width: '0.89333',
                      height: '0.05',
                      color: '0x000000',
                      fontSize: '16',
                      display: 'inline',
                      fontFamily: 'sans-serif',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'This action cannot be undone.',
                      },
                    ],
                    style: {
                      '.LabelStyle': null,
                      left: '0',
                      top: '0.32',
                      width: '0.89333',
                      height: '0.05',
                      color: '0x000000',
                      fontSize: '16',
                      display: 'inline',
                      fontFamily: 'sans-serif',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'divider',
                    style: {
                      '.DividerStyle': {
                        left: '0',
                        top: '0.35',
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
                        popUpView: 'resetUser',
                      },
                      {
                        goto: 'SignIn',
                      },
                    ],
                    text: 'CANCEL',
                    style: {
                      '.LabelStyle': {
                        left: '0',
                        top: '0.375',
                        width: '0.42',
                        height: '0.06812',
                        color: '0x007affff',
                        fontSize: '19',
                        display: 'inline',
                        backgroundColor: '0xeaeaea',
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
                        left: '0.43',
                        top: '0.35',
                        width: '0.001',
                        height: '0.06812',
                        backgroundColor: '0x00000088',
                      },
                    },
                  },
                  {
                    type: 'button',
                    onClick: [
                      {
                        actionType: 'popUpDismiss',
                        popUpView: 'resetUser',
                      },
                      {
                        goto: 'SignUp',
                      },
                    ],
                    text: 'OKAY',
                    style: {
                      '.LabelStyle': {
                        left: '0.45',
                        top: '0.375',
                        width: '0.42',
                        height: '0.06812',
                        color: '0x007affff',
                        fontSize: '19',
                        display: 'inline',
                        backgroundColor: '0xeaeaea',
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
                ],
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
                        backgroundColor: '0xeaeaea',
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
                        object: '..checkPk',
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
                            dataOut: 'SignIn.formData.pass',
                          },
                        },
                      },
                      {
                        actionType: 'evalObject',
                        object: [
                          {
                            if: [
                              '=..formData.pass',
                              {
                                '.Global.currentUser.vertex.sk@':
                                  '=..formData.sk',
                              },
                              {
                                actionType: 'popUp',
                                popUpView: 'wrongPassword',
                                wait: true,
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
                        backgroundColor: '0xeaeaea',
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
                        width: '0.002',
                        height: '0.08',
                        backgroundColor: '0x00000088',
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
