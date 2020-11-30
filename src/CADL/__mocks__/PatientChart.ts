export default {
  PatientChart: {
    pageNumber: '170',
    title: 'Patient Chart',
    init: [
      '.SignInCheck',
      '..Chart.docAPI.get',
      {
        actionType: 'evalObject',
        object: [
          {
            '.PatientChart.Chart.document@': '=..docResponse.doc.0',
          },
          {
            '.PatientChart.PatientChartObject@': '=..docResponse.doc.0',
          },
          {
            '.PatientChartDM.patientChart@': '=..docResponse.doc.0.name.data',
          },
        ],
      },
    ],
    save: [
      {
        '=.PatientChart.shareDocuments.docAPI.store': '',
      },
    ],
    PatientChartObject: '',
    Chart: {
      document: {
        '.Document': '',
        subtype: {
          isEncrypted: '1',
          isOnServer: '0',
        },
        eid: '.Global.rootNotebookID',
        type: '.DocType.PatientChart',
        name: {
          title: '',
          type: 'application/json',
          data: '',
        },
        deat: {
          sig: '',
          url: '',
        },
      },
      docAPI: {
        get: {
          '.DocAPI.get': '',
          dataKey: 'docResponse',
          ids: ['.Global.rootNotebookID'],
          xfname: 'eid',
          type: '.DocType.PatientChart',
          obfname: 'mtime',
          maxcount: '1',
        },
      },
    },
    docResponse: {
      doc: [
        {
          type: '.DocType.PatientChart',
          eid: '.Global.rootNotebookID',
          name: '',
        },
      ],
      error: '',
      jwt: '',
    },
    shareDocuments: {
      document: '',
      docAPI: {
        store: {
          api: 'cd',
          dataKey: 'shareDocuments.document',
          subtype: {
            mediaType: 'application/json',
          },
        },
      },
    },
    sharedDoc: '',
    selectedDoc: '',
    chart: '.PatientChart.PatientChartObject.name.data',
    components: [
      {
        '.BaseHeader': null,
      },
      {
        '.HeaderLeftButton': null,
      },
      {
        '.HeaderRightButton': null,
        text: 'Update',
        onClick: [
          {
            goto: 'PatientChartGeneralInfo',
          },
        ],
      },
      {
        type: 'view',
        style: {
          top: '0.1',
          left: '0',
          width: '1',
          height: '1',
        },
        children: [
          {
            type: 'view',
            style: {
              top: '0',
              left: '0',
              width: '1',
              height: '0.55',
              border: {
                style: '2',
                width: '3',
                color: '#bfbfbf',
              },
            },
            children: [
              {
                '.H6': null,
                text: 'Chart Summary',
                style: {
                  top: '0',
                  left: '0.1',
                  color: '#353535',
                  fontStyle: 'bold',
                  fontSize: '15',
                },
              },
              {
                '.H6': null,
                text: 'General Information',
                style: {
                  top: '0.05',
                  left: '0.1',
                  fontSize: '15',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'view',
                style: {
                  top: '0.13',
                  width: '0.4',
                  left: '0.1',
                },
                children: [
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'First name',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'Middle name or initial',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'Last name',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'Preferred name',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'Gender',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'Date of birth',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'Occupation',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'Relationship status',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'Primary Care Physician',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'Primary Care clinic',
                      },
                    ],
                    style: {
                      fontSize: '14',
                      color: '0x000000',
                      top: '0',
                      left: '0',
                      width: '0.4',
                      lineHeight: '30px',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.generalInfo.frstName',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      top: '0',
                      left: '0.5',
                      width: '0.4',
                      lineHeight: '30px',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.generalInfo.middleNameInitial',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      top: '0.037',
                      left: '0.5',
                      width: '0.4',
                      lineHeight: '30px',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.generalInfo.lastName',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      top: '0.074',
                      left: '0.5',
                      width: '0.4',
                      lineHeight: '30px',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.generalInfo.preferredName',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      top: '0.111',
                      left: '0.5',
                      width: '0.4',
                      lineHeight: '30px',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.generalInfo.gender',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      top: '0.148',
                      left: '0.5',
                      width: '0.4',
                      lineHeight: '30px',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.generalInfo.dateOfBirth',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      top: '0.185',
                      left: '0.5',
                      width: '0.4',
                      lineHeight: '30px',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.generalInfo.occupation',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      top: '0.222',
                      left: '0.5',
                      width: '0.4',
                      lineHeight: '30px',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.generalInfo.relationshipStatus',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      top: '0.259',
                      left: '0.5',
                      width: '0.4',
                      lineHeight: '30px',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.generalInfo.primaryCarePhysician',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      top: '0.296',
                      left: '0.5',
                      width: '0.4',
                      lineHeight: '30px',
                      textAlign: {
                        x: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.generalInfo.primaryCareClinic',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      top: '0.333',
                      left: '0.5',
                      width: '0.4',
                      lineHeight: '30px',
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
              top: '0.55',
              left: '0',
              width: '1',
              height: '0.2',
              border: {
                style: '2',
                width: '3',
                color: '#bfbfbf',
              },
            },
            children: [
              {
                '.H6': null,
                text: 'Past Medical History',
                dataKey: 'form.name.test',
                style: {
                  top: '0',
                  left: '0.1',
                  color: '#353535',
                  fontStyle: 'bold',
                  fontSize: '15',
                },
              },
              {
                type: 'list',
                contentType: 'listObject',
                listObject: '.PatientChartDM.patientChart.pastMedicalHistory',
                iteratorVar: 'itemObject',
                style: {
                  top: '0',
                  left: '0',
                  width: '1',
                  height: '0.2',
                },
                children: [
                  {
                    type: 'listItem',
                    itemObject: '',
                    style: {
                      left: '0',
                      top: '0.05',
                      width: '1',
                      height: '0.03',
                    },
                    children: [
                      {
                        type: 'label',
                        dataKey: 'itemObject.value',
                        style: {
                          top: '0',
                          left: '0.2',
                          fontSize: '13',
                        },
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
              top: '0.75',
              left: '0',
              width: '1',
              height: '0.2',
              border: {
                style: '2',
                width: '3',
                color: '#bfbfbf',
              },
            },
            children: [
              {
                '.H6': null,
                text: 'Allergies',
                style: {
                  top: '0',
                  left: '0.1',
                  color: '#353535',
                  fontSize: '15',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'label',
                text: 'Allergies/Irritant',
                style: {
                  top: '0.092',
                  left: '0.1',
                  fontWeight: 400,
                },
              },
              {
                type: 'label',
                text: 'What happens?',
                style: {
                  top: '0.092',
                  left: '0.6',
                },
              },
              {
                type: 'list',
                contentType: 'listObject',
                listObject: '..chart.allergies',
                iteratorVar: 'itemObject',
                style: {
                  top: '0.1',
                  left: '0',
                  width: '1',
                  height: '0.1',
                },
                children: [
                  {
                    type: 'listItem',
                    itemObject: '',
                    style: {
                      left: '0',
                      top: '0',
                      width: '1',
                      height: '0.03',
                    },
                    children: [
                      {
                        type: 'label',
                        dataKey: 'itemObject.allergy',
                        style: {
                          top: '0',
                          left: '0.1',
                          color: '#5f5f5f',
                          fontSize: '14',
                        },
                      },
                      {
                        type: 'label',
                        dataKey: 'itemObject.happen',
                        style: {
                          top: '0',
                          left: '0.6',
                          color: '#5f5f5f',
                          fontSize: '14',
                        },
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
              top: '0.95',
              left: '0',
              width: '1',
              height: '0.15',
              border: {
                style: '2',
                width: '3',
                color: '#bfbfbf',
              },
            },
            children: [
              {
                '.H6': null,
                text: 'Current Medications',
                style: {
                  top: '0',
                  left: '0.1',
                  color: '#353535',
                  fontStyle: 'bold',
                  fontSize: '15',
                },
              },
              {
                type: 'list',
                contentType: 'listObject',
                listObject: '..chart.currentMedications',
                iteratorVar: 'itemObject',
                style: {
                  top: '0.05',
                  left: '0',
                  width: '1',
                  height: '0.1',
                },
                children: [
                  {
                    type: 'listItem',
                    itemObject: '',
                    style: {
                      left: '0',
                      top: '0',
                      width: '1',
                      height: '0.03',
                    },
                    children: [
                      {
                        type: 'label',
                        dataKey: 'itemObject.medication',
                        style: {
                          top: '0',
                          left: '0.1',
                          width: '0.2',
                          color: '#5f5f5f',
                          fontSize: '14',
                        },
                      },
                      {
                        type: 'label',
                        dataKey: 'itemObject.strength',
                        style: {
                          top: '0',
                          left: '0.3',
                          width: '0.2',
                          color: '#5f5f5f',
                          fontSize: '14',
                        },
                      },
                      {
                        type: 'label',
                        dataKey: 'itemObject.amount',
                        style: {
                          top: '0',
                          left: '0.5',
                          width: '0.2',
                          color: '#5f5f5f',
                          fontSize: '14',
                        },
                      },
                      {
                        type: 'label',
                        dataKey: 'itemObject.frequency',
                        style: {
                          top: '0',
                          left: '0.7',
                          width: '0.2',
                          color: '#5f5f5f',
                          fontSize: '14',
                        },
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
              top: '1.1',
              left: '0',
              width: '1',
              height: '0.35',
              border: {
                style: '2',
                width: '3',
                color: '#bfbfbf',
              },
            },
            children: [
              {
                '.H6': null,
                text: 'Immunizations',
                style: {
                  top: '0',
                  left: '0.1',
                  color: '#353535',
                  fontStyle: 'bold',
                  fontSize: '15',
                },
              },
              {
                type: 'view',
                style: {
                  top: '0.06',
                  left: '0',
                  width: '1',
                },
                children: [
                  {
                    type: 'list',
                    contentType: 'listObject',
                    listObject: '..chart.immunizations',
                    iteratorVar: 'itemObject',
                    style: {
                      top: '0',
                      left: '0',
                      width: '1',
                      height: '0.2',
                    },
                    children: [
                      {
                        type: 'listItem',
                        itemObject: '',
                        style: {
                          left: '0',
                          top: '0',
                          width: '1',
                          height: '0.06',
                        },
                        children: [
                          {
                            type: 'label',
                            dataKey: 'itemObject.name',
                            style: {
                              top: '0',
                              left: '0.18',
                              color: '#5f5f5f',
                              fontSize: '14',
                            },
                          },
                          {
                            type: 'label',
                            dataKey: 'itemObject.first',
                            style: {
                              top: '0',
                              left: '0.65',
                              color: '#5f5f5f',
                              fontSize: '14',
                            },
                          },
                          {
                            type: 'label',
                            dataKey: 'itemObject.second',
                            style: {
                              top: '0.03',
                              left: '0.65',
                              color: '#5f5f5f',
                              fontSize: '14',
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
          {
            type: 'view',
            style: {
              top: '1.45',
              left: '0',
              width: '1',
              height: '0.2',
              border: {
                style: '2',
                width: '3',
                color: '#bfbfbf',
              },
            },
            children: [
              {
                '.H6': null,
                text: 'Hospitalizations',
                style: {
                  top: '0',
                  left: '0.1',
                  color: '#353535',
                  fontStyle: 'bold',
                  fontSize: '15',
                },
              },
              {
                type: 'label',
                text: 'Date',
                style: {
                  top: '0.06',
                  left: '0.1',
                },
              },
              {
                type: 'label',
                text: 'Reason',
                style: {
                  top: '0.06',
                  left: '0.6',
                },
              },
              {
                type: 'list',
                contentType: 'listObject',
                listObject: '..chart.hospitalizations',
                iteratorVar: 'itemObject',
                style: {
                  top: '0.07',
                  left: '0',
                  width: '1',
                  height: '0.1',
                },
                children: [
                  {
                    type: 'listItem',
                    itemObject: '',
                    style: {
                      left: '0',
                      top: '0',
                      width: '1',
                      height: '0.03',
                    },
                    children: [
                      {
                        type: 'label',
                        dataKey: 'itemObject.data',
                        style: {
                          top: '0',
                          left: '0.1',
                          color: '#5f5f5f',
                          fontSize: '14',
                        },
                      },
                      {
                        type: 'label',
                        dataKey: 'itemObject.reason',
                        style: {
                          top: '0',
                          left: '0.6',
                          color: '#5f5f5f',
                          fontSize: '14',
                        },
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
              top: '1.65',
              left: '0',
              width: '1',
              height: '0.2',
              border: {
                style: '2',
                width: '3',
                color: '#bfbfbf',
              },
            },
            children: [
              {
                '.H6': null,
                text: 'Surgical History',
                style: {
                  top: '0',
                  left: '0.1',
                  color: '#353535',
                  fontStyle: 'bold',
                  fontSize: '15',
                },
              },
              {
                type: 'label',
                text: 'Date',
                style: {
                  top: '0.07',
                  left: '0.1',
                },
              },
              {
                type: 'label',
                text: 'Operation/Procedure',
                style: {
                  top: '0.07',
                  left: '0.6',
                },
              },
              {
                type: 'list',
                contentType: 'listObject',
                listObject: '..chart.surgicalHistory',
                iteratorVar: 'itemObject',
                style: {
                  top: '0.08',
                  left: '0',
                  width: '1',
                  height: '0.1',
                },
                children: [
                  {
                    type: 'listItem',
                    itemObject: '',
                    style: {
                      left: '0',
                      top: '0',
                      width: '1',
                      height: '0.03',
                    },
                    children: [
                      {
                        type: 'label',
                        dataKey: 'itemObject.data',
                        style: {
                          top: '0',
                          left: '0.1',
                          color: '#5f5f5f',
                          fontSize: '14',
                        },
                      },
                      {
                        type: 'label',
                        dataKey: 'itemObject.reason',
                        style: {
                          top: '0',
                          left: '0.6',
                          color: '#5f5f5f',
                          fontSize: '14',
                        },
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
              top: '1.85',
              left: '0',
              width: '1',
              height: '0.2',
              border: {
                style: '2',
                width: '3',
                color: '#bfbfbf',
              },
            },
            children: [
              {
                '.H6': null,
                text: 'Family History',
                style: {
                  top: '0',
                  left: '0.1',
                  color: '#353535',
                  fontSize: '15',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'view',
                style: {
                  top: '0.05',
                  left: '0',
                  width: '1',
                },
                children: [
                  {
                    type: 'list',
                    contentType: 'listObject',
                    listObject: '..chart.familyHistory',
                    iteratorVar: 'itemObject',
                    style: {
                      top: '0',
                      left: '0',
                      width: '1',
                      height: '0.1',
                    },
                    children: [
                      {
                        type: 'listItem',
                        itemObject: '',
                        style: {
                          left: '0',
                          top: '0',
                          width: '1',
                          height: '0.03',
                        },
                        children: [
                          {
                            type: 'label',
                            dataKey: 'itemObject.name',
                            style: {
                              top: '0',
                              left: '0.18',
                              color: '#5f5f5f',
                              fontSize: '14',
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
          {
            type: 'view',
            style: {
              top: '2.05',
              left: '0',
              width: '1',
              height: '0.65',
              border: {
                style: '2',
                width: '3',
                color: '#bfbfbf',
              },
            },
            children: [
              {
                '.H6': null,
                text: 'Obstetrical History',
                style: {
                  top: '0',
                  left: '0.1',
                  fontSize: '15',
                  color: '#353535',
                  fontStyle: 'bold',
                },
              },
              {
                '.H6': null,
                text: 'Pregnancy',
                style: {
                  fontSize: '14',
                  top: '0.05',
                  left: '0.1',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'label',
                text: 'Currently pregnant?',
                style: {
                  top: '0.13',
                  left: '0.1',
                  color: '#5f5f5f',
                  fontSize: '14',
                },
              },
              {
                type: 'label',
                dataKey: 'chart.obstetricalHistory.pregnancy.currentlyPregnant',
                style: {
                  height: '0.025',
                  width: '0.25',
                  top: '0.13',
                  left: '0.7',
                  textAlign: {
                    x: 'right',
                  },
                },
              },
              {
                type: 'label',
                textBoard: [
                  {
                    text: 'How many times have you been pregnant?',
                  },
                  {
                    br: null,
                  },
                  {
                    text: 'How many children?',
                  },
                  {
                    br: null,
                  },
                  {
                    text: 'How many abortions?',
                  },
                ],
                style: {
                  fontSize: '14',
                  color: '#5f5f5f',
                  left: '0.09',
                  width: '0.75',
                  top: '0.16',
                  lineHeight: '2em',
                },
              },
              {
                type: 'label',
                dataKey: 'chart.obstetricalHistory.pregnancy.pregnantsTimes',
                style: {
                  fontSize: '14',
                  color: '#5f5f5f',
                  left: '0.9',
                  width: '0.1',
                  top: '0.16',
                  lineHeight: '2em',
                },
              },
              {
                type: 'label',
                dataKey: 'chart.obstetricalHistory.pregnancy.children',
                style: {
                  fontSize: '14',
                  color: '#5f5f5f',
                  left: '0.9',
                  width: '0.1',
                  top: '0.197',
                  lineHeight: '2em',
                },
              },
              {
                type: 'label',
                dataKey: 'chart.obstetricalHistory.pregnancy.abortionsTime',
                style: {
                  fontSize: '14',
                  color: '#5f5f5f',
                  left: '0.9',
                  width: '0.1',
                  top: '0.237',
                  lineHeight: '2em',
                },
              },
              {
                '.H6': null,
                text: 'Menses',
                style: {
                  fontSize: '14',
                  top: '0.25',
                  left: '0.1',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'label',
                textBoard: [
                  {
                    text: 'How often?',
                  },
                  {
                    br: null,
                  },
                  {
                    text: 'For how many days?',
                  },
                  {
                    br: null,
                  },
                ],
                style: {
                  fontSize: '14',
                  color: '#5f5f5f',
                  left: '0.09',
                  width: '0.6',
                  top: '0.32',
                  lineHeight: '2em',
                },
              },
              {
                type: 'label',
                dataKey: 'chart.obstetricalHistory.menses.howOften',
                style: {
                  fontSize: '14',
                  color: '#5f5f5f',
                  left: '0.6',
                  width: '0.3',
                  top: '0.32',
                  lineHeight: '2em',
                  textAlign: {
                    x: 'right',
                  },
                },
              },
              {
                type: 'label',
                dataKey: 'chart.obstetricalHistory.menses.howlong',
                style: {
                  fontSize: '14',
                  color: '#5f5f5f',
                  left: '0.6',
                  width: '0.3',
                  top: '0.357',
                  lineHeight: '2em',
                  textAlign: {
                    x: 'right',
                  },
                },
              },
              {
                type: 'label',
                dataKey: 'chart.obstetricalHistory.menses.isEveryMonth',
                style: {
                  fontSize: '14',
                  color: '#5f5f5f',
                  left: '0.6',
                  width: '0.3',
                  top: '0.394',
                  lineHeight: '2em',
                  textAlign: {
                    x: 'right',
                  },
                },
              },
              {
                type: 'label',
                dataKey: 'chart.obstetricalHistory.menses.isHeavyFlow',
                style: {
                  fontSize: '14',
                  color: '#5f5f5f',
                  left: '0.6',
                  width: '0.3',
                  top: '0.431',
                  lineHeight: '2em',
                  textAlign: {
                    x: 'right',
                  },
                },
              },
              {
                type: 'label',
                dataKey: 'chart.obstetricalHistory.menses.spottingOrClots',
                style: {
                  fontSize: '14',
                  color: '#5f5f5f',
                  left: '0.6',
                  width: '0.3',
                  top: '0.468',
                  lineHeight: '2em',
                  textAlign: {
                    x: 'right',
                  },
                },
              },
              {
                type: 'view',
                style: {
                  top: '0.4',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Do they occur every month?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  top: '0.44',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Heavy flow?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  top: '0.48',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Any spotting or clots?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                ],
              },
              {
                '.H6': null,
                text: 'Mammogram',
                style: {
                  fontSize: '14',
                  top: '0.5',
                  left: '0.1',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'view',
                style: {
                  top: '0.58',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Have you had a mammogram?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.obstetricalHistory.mammogram.haveMammpgram',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
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
              top: '2.7',
              left: '0',
              width: '1',
              height: '0.55',
              border: {
                style: '2',
                width: '3',
                color: '#bfbfbf',
              },
            },
            children: [
              {
                '.H6': null,
                text: 'Sexual History',
                style: {
                  top: '0',
                  left: '0.1',
                  color: '#353535',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'view',
                style: {
                  top: '0.09',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Are you sexually active?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.sexualHistory.sexuallyActive',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  top: '0.13',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Use condoms for protection?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.sexualHistory.useCondom',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  top: '0.17',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'History of STD(s)?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.sexualHistory.STDSHistory',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  top: '0.21',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Are you currently on birth control?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.sexualHistory.birthControl',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  top: '0.25',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    dataKey: 'chart.sexualHistory.biirthControlType',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                '.H6': null,
                text: 'Pap smear',
                style: {
                  fontSize: '14',
                  top: '0.29',
                  left: '0.1',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'view',
                style: {
                  top: '0.37',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Have you had a pap smear?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.sexualHistory.papSmear.havePapSmear',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                  {
                    type: 'label',
                    text: 'When was the last one?',
                    style: {
                      top: '0.04',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.sexualHistory.papSmear.lastTime',
                    style: {
                      top: '0.04',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  top: '0.49',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Ever have an abnormal result?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.sexualHistory.papSmear.abnormalResult',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
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
              top: '3.25',
              left: '0',
              width: '1',
              height: '1.4',
            },
            children: [
              {
                '.H6': null,
                text: 'Socical History',
                style: {
                  top: '0',
                  left: '0.1',
                  color: '#353535',
                  fontStyle: 'bold',
                },
              },
              {
                '.H6': null,
                text: 'Alcohol',
                style: {
                  fontSize: '14',
                  top: '0.05',
                  left: '0.1',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'view',
                style: {
                  top: '0.12',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Do you drink?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.alcohol.drink',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'What type?',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'How many drinks per week?',
                      },
                    ],
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      left: '0.09',
                      width: '0.7',
                      top: '0.04',
                      lineHeight: '2em',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.alcohol.types',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      left: '0.6',
                      width: '0.3',
                      top: '0.04',
                      lineHeight: '2em',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.alcohol.timesPerWeek',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      left: '0.6',
                      width: '0.3',
                      top: '0.077',
                      lineHeight: '2em',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                '.H6': null,
                text: 'Tobacco',
                style: {
                  fontSize: '14',
                  top: '0.23',
                  left: '0.1',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'view',
                style: {
                  top: '0.3',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Do you currently use tobacco?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.Tobacco.drink',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                '.H6': null,
                text: 'Caffeine',
                style: {
                  fontSize: '14',
                  top: '0.32',
                  left: '0.1',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'view',
                style: {
                  top: '0.4',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Do you have caffeine?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.caffeine.haveCaffeine',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'What type?',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'How many drinks per week?',
                      },
                    ],
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      left: '0.09',
                      width: '0.7',
                      top: '0.04',
                      lineHeight: '2em',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.caffeine.types',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      left: '0.6',
                      width: '0.3',
                      top: '0.04',
                      lineHeight: '2em',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.caffeine.timesPreDay',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      left: '0.6',
                      width: '0.3',
                      top: '0.077',
                      lineHeight: '2em',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                '.H6': null,
                text: 'Recreational Drugs',
                style: {
                  fontSize: '14',
                  top: '0.49',
                  left: '0.1',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'view',
                style: {
                  top: '0.57',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Do you use illicit drugs?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey:
                      'chart.socialHistory.recreationalDrug.haveIllicitDrugs',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                '.H6': null,
                text: 'Exerise',
                style: {
                  fontSize: '14',
                  top: '0.58',
                  left: '0.1',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'view',
                style: {
                  top: '0.66',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Do you exercise?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.excise.haveExcise',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'What type?',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'How many days per week?',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'How many hours per day?',
                      },
                    ],
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      left: '0.09',
                      width: '0.7',
                      top: '0.04',
                      lineHeight: '2em',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.excise.type',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      left: '0.6',
                      width: '0.3',
                      top: '0.04',
                      lineHeight: '2em',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.excise.daysPerWeek',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      left: '0.6',
                      width: '0.3',
                      top: '0.077',
                      lineHeight: '2em',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.excise.hoursPerDay',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      left: '0.6',
                      width: '0.3',
                      top: '0.104',
                      lineHeight: '2em',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                '.H6': null,
                text: 'Nutrition/Diet',
                style: {
                  fontSize: '14',
                  top: '0.8',
                  left: '0.1',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'view',
                style: {
                  top: '0.88',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Do you follow a diet?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.NutritionOrDiet.haveDite',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                  {
                    type: 'label',
                    textBoard: [
                      {
                        text: 'What type?',
                      },
                      {
                        br: null,
                      },
                      {
                        text: 'How many meals on average per day?',
                      },
                    ],
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      left: '0.09',
                      width: '0.7',
                      top: '0.04',
                      lineHeight: '2em',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.NutritionOrDiet.type',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      left: '0.6',
                      width: '0.3',
                      top: '0.04',
                      lineHeight: '2em',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.NutritionOrDiet.mealsPerDay',
                    style: {
                      fontSize: '14',
                      color: '#5f5f5f',
                      left: '0.6',
                      width: '0.3',
                      top: '0.077',
                      lineHeight: '2em',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                '.H6': null,
                text: 'Personal Safety',
                style: {
                  fontSize: '14',
                  top: '0.98',
                  left: '0.1',
                  fontStyle: 'bold',
                },
              },
              {
                type: 'view',
                style: {
                  top: '1.06',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Do you live alone?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.PersonalSafety.liveAlone',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  top: '1.1',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Do you frequently fall?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey:
                      'chart.socialHistory.PersonalSafety.frequentlyFall',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  top: '1.14',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Need assistance walking?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey:
                      'chart.socialHistory.PersonalSafety.needAssistanceWalking',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  top: '1.18',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Have you ever been abused?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.PersonalSafety.abused',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  top: '1.22',
                  width: '1',
                  left: '0',
                },
                children: [
                  {
                    type: 'label',
                    text: 'Do you wear a seatbelt?',
                    style: {
                      top: '0',
                      left: '0.1',
                      color: '#5f5f5f',
                      fontSize: '14',
                    },
                  },
                  {
                    type: 'label',
                    dataKey: 'chart.socialHistory.PersonalSafety.sealBelt',
                    style: {
                      top: '0',
                      left: '0.6',
                      width: '0.3',
                      color: '#5f5f5f',
                      fontSize: '14',
                      textAlign: {
                        x: 'right',
                      },
                    },
                  },
                ],
              },
              {
                '.SmallButton': null,
                text: 'Share',
                onClick: [
                  {
                    actionType: 'evalObject',
                    object: {
                      '=.builtIn.ecos.shareDoc': {
                        dataIn: {
                          sourceDoc: '=.PatientChart.PatientChartObject',
                          targetEdgeID: '=.Global.waitingRoom.edge.id',
                        },
                        dataOut: '=.PatientChart.sharedDoc',
                      },
                    },
                  },
                  {
                    goto: 'AppointmentDetail',
                  },
                ],
                style: {
                  top: '1.3',
                  width: '0.6',
                  left: '0.2',
                  height: '0.05',
                  backgroundColor: '#388ecc',
                },
              },
            ],
          },
        ],
      },
    ],
  },
}
