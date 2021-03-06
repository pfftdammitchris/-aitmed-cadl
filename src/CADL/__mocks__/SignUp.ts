export default {
  SignUp: {
    module: 'patient, provider, admin',
    pageNumber: '20',
    formData: {
      countryCode: '+1',
      phoneNumber: '',
      code: '',
    },
    apiData: {
      phoneNumber: '',
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
          dataIn: 'SignUp.verificationCode.edge',
          dataOut: 'SignUp.verificationCode.response',
        },
      },
    },
    newAccountFlag: '1',
    save: [
      {
        '=.builtIn.string.concat': {
          dataIn: [
            '=.SignUp.formData.countryCode',
            ' ',
            '=.SignUp.formData.phoneNumber',
          ],
          dataOut: 'SignUp.apiData.phoneNumber',
        },
      },
      {
        '=.SignUp.verificationCode.edgeAPI.store': '',
      },
    ],
    check: [
      {
        '=.SignUp.loginNewDevice.edgeAPI.store': '',
      },
      {
        if: [
          {
            '=.builtIn.string.equal': {
              dataIn: {
                string1: '=..loginNewDevice.response.code',
                string2: 112,
              },
            },
          },
          {
            actionType: 'popUp',
            popUpView: 'wrongCode',
            wait: true,
          },
          'continue',
        ],
      },
      {
        if: [
          '=.SignUp.loginNewDevice.response.edge.deat.pk',
          {
            actionType: 'popUp',
            popUpView: 'existUser',
            wait: true,
          },
          'continue',
        ],
      },
    ],
    update: [
      {
        '..newAccountFlag@': '-1',
      },
    ],
    retrieveVertex: {
      response: '',
      vertex: {
        '.Vertex': '',
        type: '-1',
        id: '=..loginNewDevice.response.edge.deat.user_id',
        name: {
          countryCode: '=.SignUp.formData.countryCode',
          phoneNumber: '=..loginNewDevice.response.edge.name.phone_number',
          verificationCode:
            '=..loginNewDevice.response.edge.name.verification_code',
        },
        uid: '=.SignUp.apiData.phoneNumber',
      },
      jwt: '=.SignUp.verificationCode.response.jwt',
      vertexAPI: {
        '.VertexAPI': '',
        store: {
          api: 'cv',
          dataIn: 'SignUp.retrieveVertex.vertex',
          dataOut: 'SignUp.retrieveVertex.response',
        },
        delete: {
          api: 'dx',
          dataIn: 'SignUp.retrieveVertex.vertex',
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
          dataIn: 'SignUp.loginNewDevice.edge',
          dataOut: 'SignUp.loginNewDevice.response',
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
          dataIn: 'SignUp.loginUser.edge',
          dataOut: 'SignUp.loginUser.response',
        },
      },
    },
    components: [
      {
        '.BaseCheckView': '',
        message: 'Please input verification code',
        viewTag: 'emptyCode',
      },
      {
        '.BaseCheckView': '',
        message: 'Incorrect verificationCode',
        viewTag: 'wrongCode',
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
            path: 'mLogo.png',
            style: {
              top: '0.08',
              width: '0.38',
              left: '0.31',
            },
          },
          {
            type: 'view',
            style: {
              top: '0.5',
              height: '0.7',
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
                text: 'Create Your Account with AiTmed',
                style: {
                  left: '0.05',
                  top: '0.05',
                  width: '0.9',
                  height: '0.041',
                  fontSize: '20',
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
                  left: '0.13',
                  top: '0.15',
                  width: '0.2',
                  height: '0.09',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Country',
                    style: {
                      color: '0x300000058',
                      left: '0',
                      top: '0',
                      width: '0.2',
                      height: '0.041',
                      fontSize: '12',
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
                      top: '0.04',
                      width: '0.2',
                      height: '0.041',
                      fontSize: '14',
                      borderWidth: '1',
                      boxSizing: 'border-box',
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
                  left: '0.36',
                  top: '0.15',
                  width: '0.61333',
                  height: '0.09',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Phone',
                    style: {
                      color: '0x300000058',
                      left: '0',
                      top: '0',
                      width: '0.747',
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
                    placeholder: 'Your phone number',
                    dataKey: 'formData.phoneNumber',
                    required: 'true',
                    style: {
                      fontSize: '14',
                      left: '0',
                      top: '0.04',
                      width: '0.525',
                      height: '0.041',
                      borderWidth: '1',
                      border: {
                        style: '2',
                      },
                      display: 'inline',
                      boxSizing: 'border-box',
                      textAlign: {
                        x: 'left',
                        y: 'center',
                      },
                    },
                  },
                ],
              },
              {
                type: 'button',
                text: 'Continue',
                style: {
                  color: '0xffffffff',
                  fontSize: '16',
                  fontStyle: 'bold',
                  left: '0.134',
                  top: '0.32',
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
                    popUpView: 'confirmView',
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  left: '0',
                  top: '0.42',
                  width: '0.8',
                  height: '0.054',
                  backgroundColor: '0xffffff',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Already have an account?',
                    style: {
                      color: '0x00000088',
                      fontSize: '15',
                      left: '0.2',
                      top: '0.015',
                      width: '0.4',
                      height: '0.03',
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
                      color: '0x3185c7ff',
                      fontSize: '14',
                      fontStyle: 'bold',
                      left: '0.6',
                      top: '0.015',
                      width: '0.25',
                      height: '0.03',
                      backgroundColor: '0xffffff00',
                      border: {
                        style: '1',
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
          {
            type: 'popUp',
            viewTag: 'existUser',
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
                    text: 'You already had an account ',
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
                    type: 'label',
                    text: 'Do you want to register for a new account?',
                    style: {
                      '.LabelStyle': {
                        left: '0.02',
                        top: '0.15',
                        width: '0.84',
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
                        popUpView: 'existUser',
                      },
                      {
                        goto: 'SignIn',
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
                        popUpView: 'existUser',
                      },
                      {
                        actionType: 'evalObject',
                        object: '..update',
                      },
                      {
                        goto: 'CreateNewAccount',
                      },
                    ],
                    text: 'OKAY',
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
            type: 'popUp',
            viewTag: 'confirmView',
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
                        popUpView: 'confirmView',
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
                        popUpView: 'confirmView',
                      },
                      {
                        actionType: 'evalObject',
                        object: '..check',
                      },
                      {
                        actionType: 'evalObject',
                        object: [
                          {
                            if: [
                              '=..formData.code',
                              'continue',
                              {
                                actionType: 'popUp',
                                popUpView: 'emptyCode',
                                wait: true,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        goto: 'CreateNewAccount',
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
