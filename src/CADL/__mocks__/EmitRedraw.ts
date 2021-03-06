export default {
  EmitRedraw: {
    pageNumber: '171',
    title: 'Patient Chart',
    generalInfo: {
      firstName: 'John',
      gender: 'Male',
      dob: '7/4/2000',
    },
    generalInfoTemp: {
      input1: [
        {
          key: 'firstNname',
          value: 'First Name',
        },
        {
          key: 'middleNameAndInitial',
          value: 'Middle Name and Initial',
        },
        {
          key: 'lastName',
          value: 'Last Name',
        },
        {
          key: 'dob',
          value: 'Date of Birth',
        },
        {
          key: 'preferredName',
          value: 'Preferred name',
        },
      ],
      gender: [
        {
          key: 'gender',
          value: 'Male',
        },
        {
          key: 'gender',
          value: 'Female',
        },
        {
          key: 'gender',
          value: 'Other',
        },
      ],
      input2: [
        {
          key: 'Occupation',
          value: '',
        },
        {
          key: 'Relationship status',
          value: '',
        },
        {
          key: 'Primary Care Physician',
          value: '',
        },
        {
          key: 'Primary Care Clinic',
          value: '',
        },
      ],
    },
    components: [
      {
        '.BaseHeader': null,
      },
      {
        '.HeaderLeftButton': null,
        onClick: [
          {
            actionType: 'builtIn',
            funcName: 'goBack',
          },
        ],
      },
      {
        '.HeaderRightButton': null,
        text: 'Skip',
        onClick: [
          {
            goto: 'PatientChartPastMedicalHistory',
          },
        ],
      },
      {
        type: 'view',
        style: {
          top: '0.1',
          left: '0',
          width: '1',
        },
        children: [
          {
            type: 'image',
            path: 'Progresspercent0.png',
            style: {
              width: '0.9',
              top: '0.02',
              height: '0.035',
              left: '0.05',
            },
          },
          {
            '.H6': null,
            text: 'General Information',
            style: {
              top: '0.03',
              left: '0.1',
              fontStyle: 'bold',
            },
          },
          {
            type: 'list',
            contentType: 'listObject',
            listObject: '..generalInfoTemp.input1',
            iteratorVar: 'itemObject',
            style: {
              top: '0.1',
              width: '1',
              height: '0.6',
              left: '0',
            },
            children: [
              {
                type: 'listItem',
                itemObject: '',
                style: {
                  left: '0',
                  top: '0',
                  width: '1',
                  height: '0.07',
                  backgroundColor: '0xffffffff',
                },
                children: [
                  {
                    type: 'label',
                    dataKey: 'itemObject.Value',
                    style: {
                      fontSize: '14',
                      top: '0',
                      left: '0.1',
                      color: '#636363',
                    },
                  },
                  {
                    '.BaseTextField': null,
                    placeholder: 'Enter',
                    dataKey: {
                      emit: {
                        dataKey: {
                          var: 'itemObject',
                        },
                        actions: [
                          {
                            '=.builtIn.object.get': {
                              dataIn: {
                                object: '=..generalInfo',
                                key: '$var.key',
                              },
                            },
                          },
                        ],
                      },
                    },
                    onChange: {
                      emit: {
                        dataKey: {
                          var: 'itemObject',
                        },
                        actions: [
                          {
                            '=.builtIn.object.set': {
                              dataIn: {
                                object: '=..generalInfo',
                                key: '$var.key',
                                value: '$var.value',
                              },
                            },
                          },
                        ],
                      },
                    },
                    style: {
                      width: '0.4',
                      left: '0.5',
                      top: '0',
                      height: '0.03',
                      fontSize: '14',
                      border: {
                        width: '3',
                        style: '6',
                        color: '#7e7e7e',
                      },
                      borderRadius: '3',
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'list',
            contentType: 'listObject',
            listObject: '..generalInfoTemp.gender',
            iteratorVar: 'itemObject',
            style: {
              axis: 'horizontal',
              top: '0.5',
              width: '1',
              height: '0.6',
              left: '0',
            },
            children: [
              {
                type: 'listItem',
                itemObject: '',
                style: {
                  left: '0.03',
                  top: '0',
                  width: '0.3',
                  height: '0.07',
                  backgroundColor: '0xffffffff',
                },
                viewTag: 'genderTag',
                children: [
                  {
                    type: 'label',
                    dataKey: 'itemObject.value',
                    style: {
                      fontSize: '13',
                      top: '0.02',
                      left: '0.08',
                    },
                  },
                  {
                    type: 'image',
                    viewTag: 'genderTag',
                    style: {
                      height: '0.05',
                      width: '0.05',
                      top: '0.02',
                      left: '0',
                    },
                    path: {
                      emit: {
                        dataKey: {
                          var: 'itemObject',
                        },
                        actions: [
                          {
                            if: [
                              {
                                '=.builtIn.object.has': {
                                  dataIn: [
                                    {
                                      object: '=..generalInfo',
                                    },
                                    {
                                      key: '$var.key',
                                    },
                                  ],
                                },
                              },
                              'selectOn.png',
                              'selectOff.png',
                            ],
                          },
                        ],
                      },
                    },
                    onClick: [
                      {
                        emit: {
                          dataKey: {
                            var: 'itemObject',
                          },
                          actions: [
                            {
                              if: [
                                {
                                  '=.builtIn.object.has': {
                                    dataIn: {
                                      object: '=..generalInfo',
                                      key: '$var.key',
                                    },
                                  },
                                },
                                {
                                  '=.builtIn.object.clear': {
                                    dataIn: {
                                      object: '=..generalInfo',
                                      key: '$var.key',
                                    },
                                  },
                                },
                                {
                                  '=.builtIn.object.set': {
                                    dataIn: {
                                      object: '=..generalInfo',
                                      key: '$var.key',
                                      value: '$var.value',
                                    },
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      },
                      {
                        actionType: 'builtIn',
                        funcName: 'redraw',
                        viewTag: 'genderTag',
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
