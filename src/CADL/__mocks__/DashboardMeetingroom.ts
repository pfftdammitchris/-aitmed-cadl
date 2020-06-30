export default {
  "DashboardMeetingroom": {
    "module": "meetingroom",
    "pageNumber": "90",
    "init": [
      "..listData.invitedroom.get",
      "..listData.hostroom.get"
    ],
    "save": [
      "..meetroom.edgeAPI.store"
    ],
    "lastTop": "0.0",
    "listData": {
      "invitedroom": {
        "links": [
          ".Edge"
        ],
        "get": {
          ".EdgeAPI.get": "",
          "dataKey": "listData.invitedroom.links",
          "id": ".Global.currentUser.vertex.id",
          "type": "1053",
          "xfname": "evid"
        }
      },
      "hostroom": {
        "links": [
          ".Edge"
        ],
        "get": {
          ".EdgeAPI.get": "",
          "dataKey": "listData.hostroom.links",
          "id": ".Global.currentUser.vertex.id",
          "type": "40000",
          "xfname": "bvid",
          "scondition": "refid=null"
        }
      }
    },
    "mockData": {
      "mockList1": [
        {
          "roomName": "1.Gary Chen Meeting Room"
        },
        {
          "roomName": "2.Dr Smith Meeting Room"
        }
      ],
      "mockList2": [
        {
          "roomName": "1.Room Created 1"
        },
        {
          "roomName": "2.Room Created 2"
        }
      ]
    },
    "roomlink": ".Edge",
    "meetroom": {
      "edge": {
        ".Edge": "",
        "type": "40000",
        "name": {
          "roomName": "Exam Room 1",
          "videoProvider": "twilio"
        },
        "refid": "",
        "deat": {
          "roomId": "",
          "accessToken": ""
        }
      },
      "edgeAPI": {
        ".EdgeAPI": "",
        "store": {
          "dataKey": "meetroom.edge"
        }
      }
    },
    "components": [
      {
        "type": "scrollView",
        "style": {
          "left": "0",
          "top": "0.0599",
          "width": "1",
          "height": "0.94",
          "backgroundColor": "0xffffffff"
        },
        "children": [
          {
            "type": "view",
            "style": {
              "left": "0",
              "top": "0",
              "width": "1",
              "height": "0.2"
            },
            "children": [
              {
                "type": "image",
                "path": "aitmedLogo.png",
                "style": {
                  "left": "0",
                  "top": "0",
                  "width": "0.21333",
                  "height": "0.10899"
                }
              },
              {
                "type": "label",
                "text": "Welcome to AiTmed \n TeleMeeting Room",
                "style": {
                  "left": "0.22",
                  "top": "0",
                  "width": "0.6",
                  "height": "0.1"
                }
              },
              {
                "type": "label",
                "text": "Invite to Join",
                "style": {
                  "left": "0",
                  "top": "0.16",
                  "width": "0.6",
                  "height": "0.04"
                }
              }
            ]
          },
          {
            "type": "list",
            "contentType": "listObject",
            "listObject": "..listData.invitedroom.links",
            "iteratorVar": "itemObject",
            "mockData": "..mockData.mockList1",
            "style": {
              "left": "0",
              "top": "0.21",
              "width": "1",
              "height": "0"
            },
            "children": [
              {
                "type": "listItem",
                "itemObject": "jojo",
                "onClick": [
                  {
                    "actionType": "updateObject",
                    "object": { "..roomlink@": "___.itemObject" }
                  },
                  {
                    "actionType": "pageJump",
                    "destination": "VideoChat"
                  }
                ],
                "style": {
                  "left": "0",
                  "top": "0",
                  "width": "1",
                  "height": "0.04",
                  "border": {
                    "style": "2",
                    "color": "0x00000018"
                  },
                  "borderWidth": "1"
                },
                "children": [
                  {
                    "type": "label",
                    "dataKey": "itemObject.name.roomName",
                    "dataName": "roomName",
                    "style": {
                      "left": "0",
                      "top": "0.005",
                      "width": "1",
                      "height": "0.03",
                      "fontSize": "13",
                      "color": "0x3185c7ff"
                    }
                  }
                ]
              }
            ]
          },
          {
            "type": "view",
            "style": {
              "left": "0",
              "top": "0.395",
              "width": "1",
              "height": "0.04"
            },
            "children": [
              {
                "type": "label",
                "text": "Create new meeting",
                "style": {
                  "left": "0",
                  "top": "0",
                  "width": "1",
                  "height": "0.04",
                  "fontSize": "18",
                  "fontStyle": "bold",
                  "color": "0x3185c7ff"
                }
              },
              {
                "type": "button",
                "text": "+",
                "onClick": [
                  {
                    "actionType": "saveObject",
                    "object": "..save"
                  },
                  {
                    "actionType": "updateObject",
                    "object": { "..roomlink@": "..meetroom.edge" }
                  },
                  {
                    "actionType": "pageJump",
                    "destination": "VideoChat"
                  }
                ],
                "style": {
                  "left": "0.8",
                  "top": "0",
                  "width": "0.07246",
                  "height": "0.03",
                  "color": "0x000000ff",
                  "fontSize": "22",
                  "backgroundColor": "0x00000000",
                  "border": {
                    "style": "5"
                  },
                  "borderRadius": "5",
                  "display": "inline",
                  "textAlign": {
                    "x": "center",
                    "y": "center"
                  }
                }
              }
            ]
          },
          {
            "type": "list",
            "contentType": "listObject",
            "listObject": "..listData.hostroom.links",
            "iteratorVar": "itemObject",
            "mockData": "..mockData.mockList2",
            "style": {
              "left": "0",
              "top": "=..lastTop",
              "width": "1",
              "height": "0"
            },
            "children": [
              {
                "type": "listItem",
                "itemObject": "hello",
                "onClick": [
                  {
                    "actionType": "updateObject",
                    "object": { "..roomlink@": "___.itemObject" }
                  },
                  {
                    "actionType": "pageJump",
                    "destination": "VideoChat"
                  }
                ],
                "style": {
                  "left": "0",
                  "top": "0",
                  "width": "1",
                  "height": "0.04",
                  "border": {
                    "style": "2",
                    "color": "0x00000018"
                  },
                  "borderWidth": "1"
                },
                "children": [
                  {
                    "type": "label",
                    "dataKey": "itemObject.name.roomName",
                    "dataName": "roomName",
                    "style": {
                      "left": "0",
                      "top": "0.005",
                      "width": "1",
                      "height": "0.03",
                      "fontSize": "13",
                      "color": "0x3185c7ff"
                    }
                  }
                ]
              }
            ]
          },
          {
            "type": "view",
            "onClick": [
              {
                "actionType": "pageJump",
                "destination": "CallHistory"
              }
            ],
            "style": {
              "left": "0",
              "top": "=..lastTop",
              "width": "1",
              "height": "0.06"
            },
            "children": [
              {
                "type": "label",
                "text": "Call History",
                "style": {
                  "left": "0",
                  "top": "0",
                  "width": "0.6",
                  "height": "0.1",
                  "color": "0x3185c7ff",
                  "fontSize": "18",
                  "fontStyle": "bold"
                }
              },
              {
                "type": "image",
                "path": "rightArrow.png",
                "style": {
                  "left": "0.75",
                  "top": "0",
                  "width": "0.08",
                  "height": "0.05"
                }
              }
            ]
          }
        ]
      },
      {
        "type": "view",
        "style": {
          "left": "0",
          "top": "0.85",
          "width": "0.74667",
          "height": "0.0408"
        },
        "children": [
          {
            "type": "image",
            "path": "logout.png",
            "style": {
              "left": "0",
              "top": "0",
              "width": "0.05333",
              "height": "0.02724"
            }
          },
          {
            "type": "button",
            "text": "Log out",
            "onClick": [
              {
                "actionType": "pageJump",
                "destination": "Logout"
              }
            ],
            "style": {
              "color": "0x0000008c",
              "fontSize": "13",
              "fontStyle": "bold",
              "left": "0.08",
              "top": "0",
              "width": "0.6667",
              "height": "0.02724",
              "backgroundColor": "0x00000000",
              "textAlign": {
                "x": "left",
                "y": "center"
              },
              "border": {
                "style": "1"
              }
            }
          },
          {
            "type": "view",
            "style": {
              "left": "0.4",
              "top": "0",
              "width": "0.7",
              "height": "0.0408"
            },
            "children": [
              {
                "type": "image",
                "path": "membership.png",
                "style": {
                  "left": "0",
                  "top": "0",
                  "width": "0.04",
                  "height": "0.0408"
                }
              },
              {
                "type": "label",
                "text": "Contact Support: 657-200-5555",
                "style": {
                  "left": "0.06",
                  "top": "0.01",
                  "width": "0.6",
                  "height": "0.0408",
                  "fontSize": "12"
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
