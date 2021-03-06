export default {
  SettingsUpdate: {
    title: 'Update Settings',
    init: [
      '.SignInCheck',
      {
        actionType: 'evalObject',
        object: {
          '=.builtIn.utils.getCountryCode': {
            dataIn: '=..myVertex.name.phoneNumber',
            dataOut: 'SettingsUpdate.formData.countryCode',
          },
        },
      },
      {
        actionType: 'evalObject',
        object: {
          '=.builtIn.utils.getPhoneNumber': {
            dataIn: '=..myVertex.name.phoneNumber',
            dataOut: 'SettingsUpdate.formData.phoneNumber',
          },
        },
      },
      {
        '..formData.firstName@': '=..myVertex.name.firstName',
      },
      {
        '..formData.lastName@': '=..myVertex.name.lastName',
      },
      {
        '..formData.userName@': '=..myVertex.name.userName',
      },
      {
        '..myVertex.tage@': '0',
      },
    ],
    myVertex: '.Global.currentUser.vertex',
    infoTemp: {
      name: [
        {
          key: 'firstName',
          value: 'First Name',
        },
        {
          key: 'lastName',
          value: 'Last Name',
        },
        {
          key: 'userName',
          value: 'Username',
        },
      ],
      phone: [
        {
          key: 'countryCode',
          value: 'Country',
        },
        {
          key: 'phoneNumber',
          value: 'Phone Number',
        },
      ],
    },
    formData: {
      firstName: 'John',
      lastName: 'Smith',
      userName: 'JohnSmith',
      countryCode: '+x',
      phoneNumber: '8888888888',
      password: 'xxxxx...',
      confirmPassword: 'xxxxx...',
      code: '',
    },
    updateApiData: {
      response: '',
      vertexAPI: {
        '.VertexAPI': '',
        store: {
          api: 'cv',
          dataIn: 'myVertex',
          dataOut: 'updateApiData.response',
        },
      },
    },
    needvCode: false,
    changedPassword: false,
    getvCodeData: {
      phoneNumber: '',
    },
    verificationCode: {
      response: '',
      edge: {
        '.Edge': '',
        type: 1011,
        _nonce: '=.Global._nonce',
        name: {
          phone_number: '=..getvCodeData.phoneNumber',
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
    save: [
      {
        '..myVertex.name.firstName@': '=..formData.firstName',
      },
      {
        '..myVertex.name.lastName@': '=..formData.lastName',
      },
      {
        '..myVertex.name.userName@': '=..formData.userName',
      },
      {
        actionType: 'evalObject',
        object: {
          '=.builtIn.string.concat': {
            dataIn: [
              '=..formData.userName',
              '=..formData.countryCode',
              ' ',
              '=..formData.phoneNumber',
            ],
            dataOut: 'SettingsUpdate.myVertex.uid',
          },
        },
      },
      {
        '=..updateApiData.vertexAPI.store': '',
      },
    ],
    update: [
      {
        '.Global.currentUser.vertex@': '=..updateApiData.response.vertex',
      },
      {
        '.Global.phoneNumber@': '=..formData.phoneNumber',
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
    updateMyVertex: [
      {
        '..myVertex.name.firstName@': '=..formData.firstName',
      },
      {
        '..myVertex.name.lastName@': '=..formData.lastName',
      },
      {
        '..myVertex.name.userName@': '=..formData.userName',
      },
      {
        '..myVertex.name.phoneNumber@': '=..getvCodeData.phoneNumber',
      },
      {
        '..myVertex.tage@': '=..formData.code',
      },
      {
        actionType: 'evalObject',
        object: {
          '=.builtIn.string.concat': {
            dataIn: [
              '=..formData.userName',
              '=..formData.countryCode',
              ' ',
              '=..formData.phoneNumber',
            ],
            dataOut: 'SettingsUpdate.myVertex.uid',
          },
        },
      },
      {
        '=..updateApiData.vertexAPI.store': '',
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
                string1: '=..updateApiData.response.code',
                string2: 1031,
              },
            },
          },
          {
            actionType: 'popUp',
            popUpView: 'sameuserid',
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
                string1: '=..updateApiData.response.code',
                string2: 112,
              },
            },
          },

          {
            actionType: 'popUp',
            popUpView: 'wrongCode',
            wait: true,
          },

          {
            actionType: 'evalObject',
            object: '..update',
          },
        ],
      },
      {
        goto: 'Settings',
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
        message: 'Username has been used',
        viewTag: 'sameuserid',
      },
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
                goto: 'Settings',
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
                text: 'First Name:',
                style: {
                  top: '0.05',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.5',
                  height: '0.03',
                },
              },
              {
                type: 'textField',
                placeholder: '..formData.firstName',
                dataKey: 'formData.firstName',
                style: {
                  top: '0.08',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.3',
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
                text: 'Last Name:',
                style: {
                  top: '0.05',
                  left: '0.45',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.5',
                  height: '0.03',
                },
              },
              {
                type: 'textField',
                placeholder: '..formData.lastName',
                dataKey: 'formData.lastName',
                style: {
                  top: '0.08',
                  left: '0.45',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.3',
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
                text: 'Username:',
                style: {
                  top: '0.17',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.2',
                  height: '0.03',
                },
              },
              {
                type: 'textField',
                placeholder: '..formData.userName',
                dataKey: 'formData.userName',
                style: {
                  top: '0.17',
                  left: '0.25',
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
                text: 'Country:',
                style: {
                  top: '0.26',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.2',
                  height: '0.03',
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
                  top: '0.29',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.15',
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
                text: 'Phone Number:',
                style: {
                  top: '0.26',
                  left: '0.35',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.25',
                  height: '0.03',
                },
              },
              {
                type: 'textField',
                viewTag: 'phoneNumberVT',
                contentType: 'phoneNumber',
                placeholder: '..formData.phoneNumber',
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
                            dataOut: 'SettingsUpdate.formData.checkOk',
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
                  top: '0.29',
                  left: '0.35',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.4',
                  height: '0.03',
                  border: {
                    style: '3',
                  },
                  borderWidth: '1.5',
                  borderRadius: '5',
                  textAlign: {
                    x: 'left',
                  },
                },
              },
              {
                type: 'label',
                text: 'New Password:',
                style: {
                  top: '0.38',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.25',
                  height: '0.03',
                },
              },
              {
                type: 'textField',
                dataKey: 'formData.password',
                style: {
                  top: '0.38',
                  left: '0.25',
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
                text: ' Confirm Password:',
                style: {
                  top: '0.47',
                  fontSize: '16',
                  fontWeight: '400',
                  width: '0.25',
                  height: '0.03',
                },
              },
              {
                type: 'textField',
                dataKey: 'formData.confirmPassword',
                style: {
                  top: '0.47',
                  left: '0.25',
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
                  '=.builtIn.string.concat': {
                    dataIn: [
                      '=..formData.countryCode',
                      ' ',
                      '=..formData.phoneNumber',
                    ],
                    dataOut: 'SettingsUpdate.getvCodeData.phoneNumber',
                  },
                },
              },
              {
                actionType: 'evalObject',
                object: [
                  {
                    if: [
                      {
                        '=.builtIn.string.equal': {
                          dataIn: {
                            string1: '=..getvCodeData.phoneNumber',
                            string2:
                              '=.Global.currentUser.vertex.name.phoneNumber',
                          },
                        },
                      },
                      'continue',
                      {
                        '..needvCode@': true,
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
                            string1: '=..formData.password',
                            string2: 'xxxxx...',
                          },
                        },
                      },
                      'continue',
                      {
                        actionType: 'evalObject',
                        object: [
                          {
                            '..needvCode@': true,
                          },
                          {
                            '..changedPassword@': true,
                          },
                        ],
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
                            string1: '=..formData.password',
                            string2: '=..formData.confirmPassword',
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
                actionType: 'evalObject',
                object: [
                  {
                    if: [
                      {
                        '=.builtIn.string.equal': {
                          dataIn: {
                            string1: '=..formData.userName',
                            string2:
                              '=.Global.currentUser.vertex.name.userName',
                          },
                        },
                      },
                      'continue',
                      {
                        '..needvCode@': true,
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
                      '=..changedPassword',
                      {
                        actionType: 'evalObject',
                        object: [
                          {
                            '=.builtIn.eccNaCl.encryptAES': {
                              dataIn: {
                                key: '=..formData.password',
                                message: '=..myVertex.sk',
                              },
                              dataOut: 'SettingsUpdate.myVertex.esk',
                            },
                          },
                        ],
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
                      '=..needvCode',
                      {
                        actionType: 'evalObject',
                        object: [
                          {
                            '=..verificationCode.edgeAPI.store': '',
                          },
                          {
                            actionType: 'popUp',
                            popUpView: 'inputVerificationCode',
                            wait: true,
                          },
                        ],
                      },
                      'continue',
                    ],
                  },
                ],
              },
              {
                actionType: 'evalObject',
                object: '..save',
              },
              {
                actionType: 'evalObject',
                object: '..update',
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
                goto: 'Settings',
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
                contentType: 'number',
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
                    object: '..updateMyVertex',
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
}
