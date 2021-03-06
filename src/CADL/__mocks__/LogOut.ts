export default {
  Logout: {
    module: 'patient',
    pageNumber: '65',
    emptyVertex: {
      vertex: '',
    },
    formData: {
      password: '',
      sk: '',
      pass: '',
    },
    save: [
      {
        '=.builtIn.eccNaCl.decryptAES': {
          dataIn: {
            key: '=..formData.password',
            message: '=.Global.currentUser.vertex.esk',
          },
          dataOut: 'Logout.formData.sk',
        },
      },
      {
        '=.builtIn.eccNaCl.skCheck': {
          dataIn: {
            pk: '=.Global.currentUser.vertex.pk',
            sk: '=..formData.sk',
          },
          dataOut: 'Logout.formData.pass',
        },
      },
    ],
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
            type: 'view',
            style: {
              left: '0',
              top: '0',
              width: '1',
              height: '1',
              backgroundColor: '0x00000088',
            },
          },
          {
            type: 'view',
            style: {
              left: '0.08',
              top: '0.21798',
              width: '0.84',
              height: '0.57221',
              backgroundColor: '0xffffffff',
              border: {
                style: '5',
              },
              borderRadius: '8',
            },
            children: [
              {
                type: 'label',
                text:
                  'It is important to remember your password, since we cannot recover it on blockchain',
                style: {
                  color: '0x00000058',
                  left: '0.04',
                  top: '0.02',
                  width: '0.7',
                  height: '0.06',
                  fontSize: '14',
                  textAlign: {
                    x: 'left',
                  },
                },
              },
              {
                type: 'label',
                text: 'Please enter your password to continue:',
                style: {
                  color: '0x00000058',
                  left: '0.04',
                  top: '0.08',
                  width: '0.7',
                  height: '0.04',
                  fontSize: '14',
                  fontWeight: '400',
                },
              },
              {
                type: 'view',
                style: {
                  left: '0.04',
                  top: '0.12',
                  width: '0.76',
                  height: '0.04',
                },
                children: [
                  {
                    type: 'textField',
                    contentType: 'password',
                    placeholder: '..formData.password',
                    dataKey: 'formData.password',
                    required: 'true',
                    style: {
                      fontSize: '14',
                      left: '0.0',
                      top: '0.0',
                      width: '0.76',
                      height: '0.035',
                      border: {
                        style: '2',
                        borderWidth: '1',
                        color: '0x00000088',
                      },
                    },
                  },
                ],
              },
              {
                type: 'label',
                contentType: 'messageHidden',
                text: 'Password Incorrect',
                style: {
                  fontSize: '14',
                  left: '0.04',
                  top: '0.17',
                  width: '0.7',
                  height: '0.035',
                  color: '0xff0000ff',
                  isHidden: 'true',
                  textAlign: {
                    x: 'center',
                    y: 'center',
                  },
                },
              },
              {
                type: 'view',
                style: {
                  left: '0.04',
                  top: '0.2',
                  width: '0.76',
                  height: '0.1',
                  shadow: 'true',
                },
                onClick: [
                  {
                    actionType: 'evalObject',
                    object: '..save',
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        if: [
                          '=..formData.pass',
                          'continue',
                          {
                            actionType: 'builtIn',
                            funcName: 'checkField',
                            contentType: 'messageHidden',
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
                          '=..formData.pass',
                          {
                            '.Global.currentUser.vertex.sk@': '',
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
                          '=..formData.pass',
                          {
                            goto: 'SignIn',
                          },
                          'continue',
                        ],
                      },
                    ],
                  },
                ],
                children: [
                  {
                    type: 'image',
                    path: 'lock.png',
                    style: {
                      left: '0.02667',
                      top: '0.03',
                      height: '0.04',
                    },
                  },
                  {
                    type: 'button',
                    text: 'Lock',
                    style: {
                      left: '0.16',
                      top: '0.01362',
                      width: '0.58667',
                      height: '0.04087',
                      color: '0x00000088',
                      fontSize: '15',
                      fontStyle: 'bold',
                    },
                  },
                  {
                    type: 'label',
                    text: 'Remember this device, only type password to sign in',
                    style: {
                      left: '0.16',
                      top: '0.06449',
                      width: '0.58667',
                      height: '0.04087',
                      color: '0x00000058',
                      fontSize: '14',
                      textAlign: {
                        x: 'left',
                      },
                    },
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  left: '0.04',
                  top: '0.32697',
                  width: '0.76',
                  height: '0.14',
                  shadow: 'true',
                },
                onClick: [
                  {
                    actionType: 'evalObject',
                    object: '..save',
                  },
                  {
                    actionType: 'evalObject',
                    object: [
                      {
                        if: [
                          '=..formData.pass',
                          'continue',
                          {
                            actionType: 'builtIn',
                            funcName: 'checkField',
                            contentType: 'messageHidden',
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
                          '=..formData.pass',
                          {
                            '.Global.currentUser.vertex.esk@': '',
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
                          '=..formData.pass',
                          {
                            '.Global.currentUser.vertex.sk@': '',
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
                          '=..formData.pass',
                          '=.builtIn.cleanLocalStorage',
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
                          '=..formData.pass',
                          {
                            goto: {
                              dataIn: {
                                destination: 'SignIn',
                                reload: true,
                              },
                            },
                          },
                          'continue',
                        ],
                      },
                    ],
                  },
                ],
                children: [
                  {
                    type: 'image',
                    path: 'logout.png',
                    style: {
                      left: '0.02667',
                      top: '0.05',
                      height: '0.04',
                    },
                  },
                  {
                    type: 'button',
                    text: 'Log out',
                    style: {
                      left: '0.16',
                      top: '0.01362',
                      width: '0.58667',
                      height: '0.04',
                      color: '0x00000088',
                      fontSize: '15',
                      fontStyle: 'bold',
                    },
                  },
                  {
                    type: 'label',
                    text:
                      'Clear credentials Username, password and device verfification needed to sign in',
                    style: {
                      left: '0.16',
                      top: '0.05449',
                      width: '0.58667',
                      height: '0.1',
                      color: '0x00000058',
                      fontSize: '14',
                      textAlign: {
                        x: 'left',
                      },
                    },
                  },
                ],
              },
              {
                type: 'button',
                text: 'Cancel',
                onClick: [
                  {
                    actionType: 'builtIn',
                    funcName: 'goBack',
                  },
                ],
                style: {
                  color: '0xffffffff',
                  left: '0.21867',
                  top: '0.49046',
                  width: '0.4',
                  height: '0.05',
                  fontSize: '16',
                  fontStyle: 'bold',
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
              },
            ],
          },
        ],
      },
    ],
  },
}
