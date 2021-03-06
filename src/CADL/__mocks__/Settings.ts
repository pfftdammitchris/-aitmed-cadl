export default {
  Settings: {
    title: 'Settings',
    init: [
      '.SignInCheck',
      {
        actionType: 'evalObject',
        object: {
          '=.builtIn.utils.getCountryCode': {
            dataIn: '=..myVertex.name.phoneNumber',
            dataOut: 'Settings.formData.countryCode',
          },
        },
      },
      {
        actionType: 'evalObject',
        object: {
          '=.builtIn.utils.getPhoneNumber': {
            dataIn: '=..myVertex.name.phoneNumber',
            dataOut: 'Settings.formData.phoneNumber',
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
    ],
    myVertex: '.Global.currentUser.vertex',
    generalInfoTemp: {
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
      password: 'xxx',
      confirmPassword: 'xxx',
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
    getvCodeData: {
      phoneNumber: '',
    },
    verificationCode: {
      response: '',
      edge: {
        '.Edge': '',
        type: 1010,
        _nonce: '=.Global._nonce',
        name: {
          phone_number: '=..getvCodeData.phoneNumber',
        },
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataIn: 'Settings.verificationCode.edge',
          dataOut: 'Settings.verificationCode.response',
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
        '=..updateApiData.vertexAPI.store': '',
      },
    ],
    update: [
      {
        '.Global.currentUser.vertex@': '=..updateApiData.response.vertex',
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
    commonStyle: {
      left: '0.1',
      fontSize: '16',
      fontWeight: '400',
      height: '0.03',
      width: '0.5',
    },
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
            type: 'button',
            text: 'Update',
            onClick: [
              {
                goto: 'SettingsUpdate',
              },
            ],
            style: {
              left: '0.82',
              top: '0',
              width: '0.18',
              height: '0.1',
              backgroundColor: '0x388eccff',
              fontSize: '17',
              color: '0xffffffff',
              zIndex: 100,
              textAlign: {
                y: 'center',
              },
            },
          },
          {
            type: 'view',
            style: {
              marginTop: '0.1',
              height: '0.15',
            },
            children: [
              {
                type: 'label',
                text: 'First Name:',
                style: {
                  '..commonStyle': '',
                  top: '0.05',
                },
              },
              {
                type: 'label',
                dataKey: 'formData.firstName',
                style: {
                  '..commonStyle': '',
                  top: '0.08',
                  width: '0.3',
                  border: {
                    style: '2',
                  },
                  borderWidth: '1.5',
                  borderColor: '0xc2c2c2',
                },
              },
              {
                type: 'label',
                text: 'Last Name:',
                style: {
                  '..commonStyle': '',
                  top: '0.05',
                  left: '0.55',
                },
              },
              {
                type: 'label',
                dataKey: 'formData.lastName',
                style: {
                  '..commonStyle': '',
                  top: '0.08',
                  left: '0.55',
                  width: '0.3',
                  border: {
                    style: '2',
                  },
                  borderWidth: '1.5',
                  borderColor: '0xc2c2c2',
                },
              },
            ],
          },
          {
            type: 'view',
            style: {
              marginTop: '0.02',
              height: '0.1',
            },
            children: [
              {
                type: 'label',
                text: 'Username:',
                style: {
                  '..commonStyle': '',
                  top: '0',
                  width: '0.3',
                },
              },
              {
                type: 'label',
                dataKey: 'formData.userName',
                style: {
                  '..commonStyle': '',
                  top: '0',
                  left: '0.35',
                  border: {
                    style: '2',
                  },
                  borderWidth: '1.5',
                  borderColor: '0xc2c2c2',
                },
              },
            ],
          },
          {
            type: 'view',
            style: {
              height: '0.1',
            },
            children: [
              {
                type: 'label',
                text: 'Phone Number:',
                style: {
                  '..commonStyle': '',
                  top: '0',
                  width: '0.25',
                },
              },
              {
                type: 'label',
                dataKey: 'myVertex.name.phoneNumber',
                style: {
                  '..commonStyle': '',
                  top: '0',
                  left: '0.35',
                  border: {
                    style: '2',
                  },
                  borderWidth: '1.5',
                  borderColor: '0xc2c2c2',
                  textAlign: {
                    x: 'left',
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
