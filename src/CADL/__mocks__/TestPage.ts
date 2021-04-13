export default {
  TestPage: {
    title: 'New Connections',
    init: [
      '.SignInCheck',
      {
        actionType: 'evalObject',
        object: {
          '.Global._nonce@': {
            '=.builtIn.math.random': '',
          },
        },
      },
      '..invite.edgeAPI.get',
      '..facilityInvite.edgeAPI.get',
    ],
    testVertex: {
      response: {
        vertex: '',
      },
      vertex: {
        Vertex: '',
        jwt: 'hellovert',
      },
      vertexAPI: {
        '.VertexAPI': '',
        store: {
          api: 'cv',
          dataIn: 'testVertex.vertex',
          dataOut: 'testVertex.response',
        },
        get: {
          api: 'rv',
          dataIn: 'testVertex.vertex',
          dataOut: 'testVertex.response',
        },
      },
    },
    testEdge: {
      response: {
        edge: '',
      },
      edge: {
        '.Edge': '',
        type: '10000',
        name: {
          InviteePhoneNumber: '+1 8885098864',
          firstName: 'greg',
          lastName: 'hender',
          fullName: '',
          InviterName: '.Global.currentUser.vertex.name.fullName',
        },
      },
      edgeAPI: {
        '.EdgeAPI': '',
        store: {
          api: 'ce',
          dataIn: 'testEdge.edge',
          dataOut: 'testEdge.response',
        },
        get: {
          api: 're',
          dataIn: 'testEdge.edge',
          dataOut: 'testEdge.response',
        },
      },
    },
    testDocument: {
      response: {
        document: '',
      },
      document: {
        '.Document': '',
        jwt: 'hellodoc',
        eid: '=..testEdge.response.edge.id',
      },
      documentAPI: {
        '.DocumentAPI': '',
        store: {
          api: 'cd',
          dataIn: 'testDocument.document',
          dataOut: 'testDocument.response',
        },
        get: {
          api: 'rd',
          dataIn: 'testDocument.document',
          dataOut: 'testDocument.response',
        },
      },
    },
    invite: {
      inviteList: {
        edge: '',
      },
      createRes: {
        edge: '',
      },
      edge: {
        '.Edge': '',
        type: '1050',
        _nonce: '=.Global._nonce',
        jwt: 'fdsdfsdf',
        name: {
          InviteePhoneNumber: '+1 8885098864',
          firstName: 'greg',
          lastName: 'hender',
          fullName: '',
          InviterName: '.Global.currentUser.vertex.name.fullName',
        },
      },
      edgeAPI: {
        '.EdgeAPI': '',
        get: {
          api: 're',
          type: '1050',
          xfname: 'evid',
          id: '.Global.currentUser.vertex.id',
          maxcount: '10000',
          dataKey: 'invite.inviteList',
          sCondition: 'subtype<65536',
          _nonce: '=.Global._nonce',
        },
        store: {
          api: 'ce',
          dataIn: 'invite.edge',
          dataOut: 'invite.createRes',
        },
      },
    },
    facilityInvite: {
      inviteList: {
        edge: '',
      },
      edgeAPI: {
        get: {
          api: 're',
          type: '1050',
          xfname: 'evid',
          id: '.Global.currentUser.vertex.id',
          maxcount: '10000',
          dataKey: 'facilityInvite.inviteList',
          sCondition:
            'name like \'%"inviterCategory":"Facility"%\' AND subtype<65536',
          _nonce: '=.Global._nonce',
        },
      },
    },
    accept: {
      edge: {
        '.Edge': '',
        type: '1060',
        bvid: '.Global.currentUser.vertex.id',
        name: '',
      },
      edgeAPI: {
        store: {
          api: 'ce',
          dataIn: 'accept.edge',
        },
      },
    },
    components: [
      {
        '.BaseHeader': null,
      },
      {
        '.HeaderLeftButton': null,
      },
      {
        type: 'button',
        onClick: [
          {
            actionType: 'evalObject',
            object: {
              '=..testEdge.edgeAPI.store': '',
              '=..testDocument.documentAPI.store': '',
              '.Global._nonce@': {
                '=.builtIn.math.random': '',
              },
            },
          },
        ],
        text: 'Invite',
        style: {
          color: '0xFFFFFF',
          backgroundColor: '0x388eccff',
          zIndex: '1',
          left: '0.2',
          top: '0.8',
          width: '0.6',
          height: '0.05',
          border: {
            style: '5',
          },
          borderRadius: '0',
          display: 'inline',
          textAlign: {
            x: 'center',
            y: 'center',
          },
        },
      },
      {
        type: 'scrollView',
        style: {
          left: '0',
          top: '0.1',
          width: '1',
          height: '0.9',
          backgroundColor: '0xffffffff',
        },
        viewTag: 'InviteTag2',
        children: [
          {
            type: 'view',
            style: {
              marginTop: '0',
              left: '0',
              width: '1',
              height: '0.05',
              backgroundColor: '0xf3f3f3ff',
            },
            children: [
              {
                type: 'label',
                text: 'New Organizations',
                style: {
                  left: '0.06',
                  height: '0.05',
                  width: '0.5',
                  textAlign: {
                    y: 'center',
                  },
                },
              },
            ],
          },
          {
            type: 'list',
            contentType: 'listObject',
            listObject: '..facilityInvite.inviteList.edge',
            iteratorVar: 'itemObject',
            style: {
              left: '0',
              marginTop: 'auto',
              width: '0.98',
              height: 'auto',
            },
            children: [
              {
                type: 'listItem',
                itemObject: '',
                style: {
                  height: '0.08',
                  left: '0.005',
                  backgroundColor: '0xFFFFFF',
                  width: '0.99',
                  border: {
                    style: '3',
                  },
                },
                children: [
                  {
                    type: 'image',
                    path: 'woman.png',
                    style: {
                      top: '0.008',
                      left: '0.06',
                      width: '0.13',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'itemObject.name.inviterName',
                    style: {
                      top: '0',
                      left: '0.31',
                      width: '0.6',
                      height: '0.08',
                      fontSize: '18',
                      color: '#6e6e6e',
                      textAlign: {
                        y: 'center',
                      },
                    },
                  },
                  {
                    type: 'button',
                    text: 'Accept',
                    onClick: [
                      {
                        emit: {
                          dataKey: {
                            var: 'itemObject',
                          },
                          actions: [
                            {
                              '..accept.edge.evid@': '$var.bvid',
                            },
                            {
                              '..accept.edge.name@': '$var.name',
                            },
                            {
                              '..accept.edge.refid@': '$var.id',
                            },
                            {
                              '=..accept.edgeAPI.store': '',
                            },
                          ],
                        },
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
                        actionType: 'evalObject',
                        object: [
                          {
                            '=..invite.edgeAPI.get': '',
                          },
                        ],
                      },
                      {
                        actionType: 'builtIn',
                        funcName: 'redraw',
                        viewTag: 'inviteTag',
                      },
                    ],
                    style: {
                      top: '0.02',
                      left: '0.75',
                      width: '0.18',
                      height: '0.04',
                      fontSize: '15',
                      color: '#ffffff',
                      backgroundColor: '#1dc160',
                      borderRadius: '5',
                      textAlign: {
                        x: 'center',
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
              marginTop: 'auto',
              left: '0',
              width: '1',
              height: '0.05',
              backgroundColor: '0xf3f3f3ff',
            },
            children: [
              {
                type: 'label',
                text: 'New Friends',
                style: {
                  left: '0.06',
                  top: '0',
                  height: '0.05',
                  width: '0.5',
                  textAlign: {
                    y: 'center',
                  },
                },
              },
            ],
          },
          {
            '.BaseList': null,
            // viewTag: 'InviteTag2',
            type: 'list',
            contentType: 'listObject',
            iteratorVar: 'itemObject',
            listObject: '..invite.inviteList.edge',
            style: {
              left: '0',
              marginTop: 'auto',
              width: '1',
              height: '0.4',
              zIndex: '100',
              backgroundColor: '#EAEAEA',
            },
            children: [
              {
                type: 'listItem',
                itemObject: '',
                style: {
                  height: '0.08',
                  left: '0.005',
                  backgroundColor: '0xFFFFFF',
                  width: '0.99',
                  border: {
                    style: '3',
                  },
                },
                children: [
                  {
                    type: 'image',
                    path: 'woman.png',
                    style: {
                      top: '0.008',
                      left: '0.06',
                      width: '0.14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'itemObject.name.inviterName',
                    style: {
                      top: '0.024',
                      left: '0.11',
                      width: '0.6',
                      height: '0.2',
                      fontSize: '18',
                      color: '#6e6e6e',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'button',
                    text: 'Accept',
                    onClick: [
                      {
                        emit: {
                          dataKey: {
                            var: 'itemObject',
                          },
                          actions: [
                            {
                              '..accept.edge.evid@': '$var.bvid',
                            },
                            {
                              '..accept.edge.name@': '$var.name',
                            },
                            {
                              '..accept.edge.refid@': '$var.id',
                            },
                            {
                              '=..accept.edgeAPI.store': '',
                            },
                          ],
                        },
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
                        actionType: 'evalObject',
                        object: [
                          {
                            '..invite.inviteList.edge@': [],
                          },
                        ],
                      },
                      {
                        actionType: 'evalObject',
                        object: [
                          {
                            '=..invite.edgeAPI.get': '',
                          },
                        ],
                      },
                      {
                        actionType: 'builtIn',
                        funcName: 'redraw',
                        viewTag: 'InviteTag2',
                      },
                    ],
                    style: {
                      top: '0.02',
                      left: '0.75',
                      width: '0.18',
                      height: '0.04',
                      fontSize: '15',
                      color: '#ffffff',
                      backgroundColor: '#1dc160',
                      borderRadius: '5',
                      textAlign: {
                        x: 'center',
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
