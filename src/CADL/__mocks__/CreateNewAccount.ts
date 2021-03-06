export default {
  CreateNewAccount: {
    module: 'patient',
    title: 'Create New Account',
    pageNumber: '45',
    formData: {
      response: '',
      vertex: {
        '.Vertex': '',
        type: '.SignUp.newAccountFlag',
        name: {
          countryCode: '.SignUp.formData.countryCode',
          phoneNumber: '.SignUp.formData.phoneNumber',
          userName: '',
          firstName: '',
          lastName: '',
          password: '',
          confirmPassword: '',
          avatar: 'https://public.aitmed.com/avatar/JohnDoe.jpg',
          verificationCode: '.SignUp.formData.code',
          signature: '',
        },
      },
      vertexAPI: {
        '.VertexAPI': '',
        store: {
          api: 'builtIn.createNewAccount',
          dataIn: 'formData.vertex',
          dataOut: 'formData.response',
        },
      },
      target: false,
      tar: false,
      confirm: '',
    },
    jwt: {
      response: '',
      edge: {
        '.Edge': '',
        type: 1030,
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataIn: 'jwt.edge',
          dataOut: 'jwt.response',
        },
      },
    },
    save: ['..jwt.edgeAPI.store', '..formData.vertexAPI.store'],
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
    ],
    components: [
      {
        '.BaseCheckView': '',
        message: 'Incorrect verificationCode',
        viewTag: 'wrongCode',
      },
      {
        '.BaseCheckView': '',
        message: 'Password should be same',
        viewTag: 'samePassword',
      },
      {
        '.BaseCheckView': '',
        message: 'Please fill out required fields',
        viewTag: 'inputPassword',
      },
      {
        '.BaseCheckView': '',
        message: 'Please check the box',
        viewTag: 'noSelected',
      },
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
          top: '0.05',
          width: '0.38',
          left: '0.31',
        },
      },
      {
        type: 'scrollView',
        style: {
          left: '0',
          top: '0',
          width: '1',
          height: '1',
        },
        children: [
          {
            type: 'view',
            style: {
              top: '0.25',
              height: '1',
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
                text: 'Create New Account with AiTmed',
                style: {
                  color: '0x3185c7ff',
                  left: '0.05',
                  top: '0.02',
                  width: '0.9',
                  height: '0.041',
                  fontSize: '18',
                  fontStyle: 'bold',
                  display: 'inline',
                  textAlign: {
                    x: 'center',
                    y: 'center',
                  },
                },
              },
              {
                type: 'label',
                text: 'Fill out required fields*',
                style: {
                  top: '0.06',
                  width: '1',
                  height: '0.01',
                  fontSize: '14',
                  color: '0xD53C42',
                  textAlign: {
                    x: 'center',
                  },
                },
              },
              {
                type: 'view',
                style: {
                  left: '0.121',
                  top: '0.1',
                  width: '0.2',
                  height: '0.09',
                },
                children: [
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'Country',
                      },
                      {
                        text: '*',
                        color: '0xD53C42',
                      },
                    ],
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
                  top: '0.1',
                  width: '0.61333',
                  height: '0.09',
                },
                children: [
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'Phone',
                      },
                      {
                        text: '*',
                        color: '0xD53C42',
                      },
                    ],
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
                  top: '0.2',
                  left: '0.121',
                  height: '0.1',
                  width: '0.3',
                },
                children: [
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'First Name',
                      },
                      {
                        text: '*',
                        color: '0xD53C42',
                      },
                    ],
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
                    placeholder: 'Enter here',
                    dataKey: 'formData.vertex.name.firstName',
                    required: 'true',
                    style: {
                      fontSize: '14',
                      left: '0',
                      backgroundColor: '0xffffff',
                      top: '0.05',
                      width: '0.3',
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
                  top: '0.2',
                  left: '0.57',
                  height: '0.1',
                  width: '0.3',
                },
                children: [
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'Last Name',
                      },
                      {
                        text: '*',
                        color: '0xD53C42',
                      },
                    ],
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
                    placeholder: 'Enter here',
                    dataKey: 'formData.vertex.name.lastName',
                    required: 'true',
                    style: {
                      fontSize: '14',
                      left: '0',
                      backgroundColor: '0xffffff',
                      top: '0.05',
                      width: '0.3',
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
                  top: '0.3',
                  left: '0.121',
                  width: '0.87',
                  height: '0.1',
                },
                children: [
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'Username',
                      },
                      {
                        text: '*',
                        color: '0xD53C42',
                      },
                    ],
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
                    placeholder: 'Create your own',
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
                  top: '0.4',
                  left: '0.121',
                  height: '0.1',
                  width: '0.87',
                },
                children: [
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'New Password',
                      },
                      {
                        text: '*',
                        color: '0xD53C42',
                      },
                    ],
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
                    placeholder: 'Enter here',
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
                  top: '0.5',
                  left: '0.121',
                  height: '0.1',
                  width: '0.87',
                },
                children: [
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'Confirm Password',
                      },
                      {
                        text: '*',
                        color: '0xD53C42',
                      },
                    ],
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
                    placeholder: 'Enter here',
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
                  top: '0.63',
                  left: '0.1',
                  width: '0.9',
                  height: '0.3',
                },
                children: [
                  {
                    type: 'image',
                    viewTag: 'select',
                    onClick: [
                      {
                        emit: {
                          actions: [
                            {
                              if: [
                                '=.CreateNewAccount.formData.target',
                                {
                                  '.CreateNewAccount.formData.target@': false,
                                },
                                {
                                  '.CreateNewAccount.formData.target@': true,
                                },
                              ],
                            },
                          ],
                        },
                      },
                      {
                        actionType: 'builtIn',
                        funcName: 'redraw',
                        viewTag: 'select',
                      },
                    ],
                    path: {
                      emit: {
                        actions: [
                          {
                            if: [
                              '=.CreateNewAccount.formData.target',
                              'https://public.aitmed.com/commonRes/selectOn.png',
                              'https://public.aitmed.com/commonRes/selectOff.png',
                            ],
                          },
                        ],
                      },
                    },
                    style: {
                      left: '0',
                      width: '0.05',
                      top: '0.015',
                    },
                  },
                  {
                    type: 'label',
                    style: {
                      color: '0x000000',
                      left: '0.07',
                      top: '0.01',
                      fontSize: '11',
                      width: '0.72',
                      height: '0.03',
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
                        text: '??',
                      },
                      {
                        text: 'AiTmed Terms of Use Agreement',
                        color: '0x69AAD8',
                      },
                      {
                        text: '??',
                      },
                      {
                        text: ' and ',
                      },
                    ],
                  },
                  {
                    type: 'label',
                    style: {
                      color: '0x000000',
                      left: '0.07',
                      top: '0.035',
                      width: '0.72',
                      height: '0.03',
                      fontSize: '11',
                      textAlign: {
                        x: 'left',
                      },
                    },
                    onClick: [
                      {
                        goto: 'ServicesAgreement',
                      },
                    ],
                    textBoard: [
                      {
                        text: 'AiTmed Master Subscription Agreement',
                        color: '0x69AAD8',
                      },
                    ],
                  },
                  {
                    type: 'image',
                    viewTag: 'select',
                    onClick: [
                      {
                        emit: {
                          actions: [
                            {
                              if: [
                                '=.CreateNewAccount.formData.tar',
                                {
                                  '.CreateNewAccount.formData.tar@': false,
                                },
                                {
                                  '.CreateNewAccount.formData.tar@': true,
                                },
                              ],
                            },
                          ],
                        },
                      },
                      {
                        actionType: 'builtIn',
                        funcName: 'redraw',
                        viewTag: 'select',
                      },
                    ],
                    path: {
                      emit: {
                        actions: [
                          {
                            if: [
                              '=.CreateNewAccount.formData.tar',
                              'https://public.aitmed.com/commonRes/selectOn.png',
                              'https://public.aitmed.com/commonRes/selectOff.png',
                            ],
                          },
                        ],
                      },
                    },
                    style: {
                      left: '0',
                      width: '0.05',
                      top: '0.065',
                    },
                  },
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'I also agree to',
                      },
                      {
                        text: '????',
                      },
                      {
                        text: 'AiTmed Privacy Policy ',
                        color: '0x69aad8',
                      },
                    ],
                    onClick: [
                      {
                        goto: 'PrivacyPolicy',
                      },
                    ],
                    style: {
                      color: '0x000000',
                      left: '0.07',
                      top: '0.065',
                      width: '0.72',
                      height: '0.03',
                      fontSize: '11',
                      lineHeight: '2',
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
                  top: '0.76',
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
                    object: [
                      {
                        if: [
                          '=..formData.target',
                          'continue',
                          {
                            actionType: 'popUp',
                            popUpView: 'noSelected',
                            wait: true,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        if: [
                          '=..formData.tar',
                          'continue',
                          {
                            actionType: 'popUp',
                            popUpView: 'noSelected',
                            wait: true,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        if: [
                          '=..formData.vertex.name.password',
                          'continue',
                          {
                            actionType: 'popUp',
                            popUpView: 'inputPassword',
                            wait: true,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        if: [
                          '=..formData.vertex.name.userName',
                          'continue',
                          {
                            actionType: 'popUp',
                            popUpView: 'inputPassword',
                            wait: true,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        if: [
                          '=..formData.vertex.name.firstName',
                          'continue',
                          {
                            actionType: 'popUp',
                            popUpView: 'inputPassword',
                            wait: true,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        if: [
                          '=..formData.vertex.name.lastName',
                          'continue',
                          {
                            actionType: 'popUp',
                            popUpView: 'inputPassword',
                            wait: true,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        if: [
                          {
                            '=.builtIn.string.equal': {
                              dataIn: {
                                string1: '=..formData.vertex.name.password',
                                string2:
                                  '=..formData.vertex.name.confirmPassword',
                              },
                            },
                          },
                          'continue',
                          {
                            actionType: 'popUp',
                            popUpView: 'samePassword',
                            wait: true,
                          },
                        ],
                      },
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
                    actionType: 'evalObject',
                    object: {
                      '=.builtIn.eccNaCl.decryptAES': {
                        dataIn: {
                          key: '=..formData.vertex.name.password',
                          message: '=..formData.response.vertex.esk',
                        },
                        dataOut: 'Global.currentUser.vertex.sk',
                      },
                    },
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        if: [
                          '=..formData.response.vertex.pk',
                          {
                            goto: 'MeetingRoomInvited',
                          },
                          {
                            actionType: 'popUp',
                            popUpView: 'wrongCode',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        if: [
                          '=..formData.response.vertex.pk',
                          'continue',
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
                type: 'view',
                style: {
                  left: '0',
                  top: '0.82',
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
                        x: 'left',
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
    ],
  },
}
