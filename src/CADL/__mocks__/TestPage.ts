export default {
  generalInfo: {
    gender: '',
  },
  var: {
    red: true,
    green: 4,
  },
  actions: [
    {
      if: ['.TestPage.var.red', { '.TestPage.var.green@': 9 }, 'continue'],
    },
  ],
  actions1: [
    {
      if: ['false', { '.TestPage.var.green@': 9 }, 'continue'],
    },
  ],

  emit1: {
    dataKey: {
      var: {
        key: 'gender',
        value: 'Male',
      },
    },
    actions: [
      {
        if: [
          {
            '=.builtIn.string.equal': {
              dataIn: {
                string1: '$var.value',
                string2: 'Male',
              },
            },
          },
          {
            '.TestPage.generalInfo.gender@': 'Female',
          },
          'continue',
        ],
      },
      {
        '.TestPage.generalInfo.gender@': 'Other',
      },
      {
        '.TestPage.generalInfo.gender@': 'Male',
      },
    ],
  },
  emit2: {
    dataKey: {
      var: {
        key: 'gender',
        value: 'Female',
      },
    },
    actions: [
      {
        if: [
          {
            '=.builtIn.string.equal': {
              dataIn: {
                string1: '$var.value',
                string2: 'Male',
              },
            },
          },
          {
            '=.builtIn.object.remove': {
              dataIn: {
                object: '=.TestPage.generalInfo',
                key: '$var.key',
              },
            },
          },
          {
            '=.builtIn.object.set': {
              dataIn: {
                object: '=.TestPage.generalInfo',
                key: '$var.key',
                value: 'Male',
              },
            },
          },
        ],
      },
    ],
  },
  emit3: {
    dataKey: {
      var: {
        key: 'gender',
        value: 'Male',
      },
    },
    actions: [
      {
        if: [
          {
            '=.builtIn.string.equal': {
              dataIn: {
                string1: '=.TestPage.generalInfo.gender',
                string2: '$var.key',
              },
            },
          },
          'selectOff.png',
          'selectOn.png',
        ],
      },
    ],
  },
}
