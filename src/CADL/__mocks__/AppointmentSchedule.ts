export default {
  AppointmentSchedule: {
    title: 'Appointment Schedule',
    init: [
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
        object: {
          '.AppointmentSchedule.calendarDate.month@': {
            '=.builtIn.date.getMonth': '',
          },
        },
      },
      {
        actionType: 'evalObject',
        object: {
          '.AppointmentSchedule.calendarDate.year@': {
            '=.builtIn.date.getYear': '',
          },
        },
      },
      {
        actionType: 'evalObject',
        object: {
          '.AppointmentSchedule.calendarDate.day@': {
            '=.builtIn.date.getDate': '',
          },
        },
      },
      {
        actionType: 'evalObject',
        object: [
          {
            '=.builtIn.date.calendarArray': {
              dataIn: {
                year: '=..calendarDate.year',
                month: '=..calendarDate.month',
              },
              dataOut: 'AppointmentSchedule.calendarDate.dayLable',
            },
          },
        ],
      },
      {
        actionType: 'evalObject',
        object: [
          {
            '=.builtIn.string.concat': {
              dataIn: [
                '=..calendarDate.year',
                '-',
                '=..calendarDate.month',
                '-',
                '=..calendarDate.day',
              ],
              dataOut: 'AppointmentSchedule.calendarDate.todayDate',
            },
          },
        ],
      },
      {
        actionType: 'evalObject',
        object: [
          {
            '=.builtIn.date.getTimeStampOfDate': {
              dataIn: {
                date: '=..calendarDate.todayDate',
              },
              dataOut: 'AppointmentSchedule.calendarDate.todayStamp',
            },
          },
        ],
      },
      {
        actionType: 'evalObject',
        object: [
          {
            '=.builtIn.string.concat': {
              dataIn: [
                'stime>',
                '=..calendarDate.todayStamp.start',
                ' AND ',
                'etime<',
                '=..calendarDate.todayStamp.end',
              ],
              dataOut: 'Global.scheduleScondition',
            },
          },
        ],
      },
      {
        actionType: 'evalObject',
        object: {
          '.Global.scheduleId@':
            '=.AppointmentSchedule.scheduleSetting.schedule.edge.0.id',
        },
      },
      '..scheduleSetting.get',
      '..schedule.get',
    ],
    scheduleSetting: {
      schedule: {
        edge: '',
      },
      get: {
        '.EdgeAPI.get': '',
        api: 're',
        dataKey: 'scheduleSetting.schedule',
        type: 40000,
        id: '.Global.currentUser.vertex.id',
        sCondition: 'subtype=3',
        xfname: 'bvid',
        maxcount: '1',
        obfname: 'ctime',
        _nonce: '=.Global._nonce',
      },
    },
    schedule: {
      scheduleList: null,
      edge: {
        type: 40000,
        id: '..scheduleSetting.schedule.edge.0.id',
        sCondition: '=.Global.scheduleScondition',
        maxcount: '10000',
        xfname: 'refid',
        obfname: 'etime',
        asc: true,
        _nonce: '=.Global._nonce',
      },
      get: {
        '.EdgeAPI.get': '',
        api: 're',
        dataIn: 'schedule.edge',
        dataOut: 'schedule.scheduleList',
      },
    },
    calendarDate: {
      month: '',
      year: '',
      day: '',
      dayLable: [],
      weekLabel: [
        {
          key: 'SU',
        },
        {
          key: 'MO',
        },
        {
          key: 'TU',
        },
        {
          key: 'WE',
        },
        {
          key: 'TH',
        },
        {
          key: 'FR',
        },
        {
          key: 'SA',
        },
      ],
      todayDate: 'YYYY-MM-DD',
      calendarDate: null,
      Scondition: '',
    },
    components: [
      {
        '.BaseHeader': null,
      },
      {
        '.HeaderLeftButton': null,
      },
      {
        '.HeaderRightImg': null,
        path: 'addMeeting.png',
        onClick: [
          {
            goto: 'AppointmentInfo',
          },
        ],
      },
      {
        type: 'view',
        style: {
          left: '0',
          top: '0',
          width: '1',
          height: '0.94',
        },
        children: [
          {
            '.calendarView': null,
            children: [
              {
                type: 'image',
                path: 'user.png',
                style: {
                  height: '30px',
                  left: '20px',
                  top: '0.01',
                },
                onClick: [
                  {
                    goto: 'AppointmentRequest',
                  },
                ],
              },
              {
                type: 'select',
                contentType: 'month',
                options: '.Month',
                style: {
                  width: '0.15',
                  left: '0.2',
                  height: '30px',
                  top: '0.01',
                  border: 'none',
                },
                dataKey: 'calendarDate.month',
                onChange: [
                  {
                    emit: {
                      actions: [
                        {
                          '=.builtIn.date.calendarArray': {
                            dataIn: {
                              year: '=..calendarDate.year',
                              month: '=..calendarDate.month',
                            },
                            dataOut:
                              'AppointmentSchedule.calendarDate.dayLable',
                          },
                        },
                      ],
                    },
                  },
                  {
                    actionType: 'builtIn',
                    funcName: 'redraw',
                    viewTag: 'calendar',
                  },
                ],
              },
              {
                type: 'select',
                contentType: 'year',
                options: '.Year',
                style: {
                  width: '0.15',
                  height: '30px',
                  left: '0.4',
                  top: '0.01',
                  border: 'none',
                },
                dataKey: 'calendarDate.year',
                onChange: [
                  {
                    emit: {
                      actions: [
                        {
                          '=.builtIn.date.calendarArray': {
                            dataIn: {
                              year: '=..calendarDate.year',
                              month: '=..calendarDate.month',
                            },
                            dataOut:
                              'AppointmentSchedule.calendarDate.dayLable',
                          },
                        },
                      ],
                    },
                  },
                  {
                    actionType: 'builtIn',
                    funcName: 'redraw',
                    viewTag: 'calendar',
                  },
                ],
              },
              {
                type: 'label',
                text: 'ScheduleSettings',
                style: {
                  width: '0.3',
                  height: '30px',
                  left: '0.64',
                  top: '0.01',
                  color: '0x1b8ec9',
                  fontSize: '15',
                  border: 'none',
                  lineHeight: '30px',
                  textAlign: {
                    x: 'right',
                  },
                },
                onClick: [
                  {
                    goto: 'ScheduleSettings',
                  },
                ],
              },
              {
                type: 'view',
                style: {
                  width: '1',
                  display: 'flex',
                  justifyContent: 'center',
                  height: '50px',
                  top: '0.04',
                },
                children: [
                  {
                    type: 'list',
                    contentType: 'listObject',
                    listObject: '..calendarDate.weekLabel',
                    iteratorVar: 'itemObject',
                    style: {
                      width: '320px',
                      display: 'flex',
                      height: '50px',
                      justifyContent: 'space-between',
                    },
                    children: [
                      {
                        type: 'listItem',
                        itemObject: '',
                        style: {
                          top: '0',
                          width: '44px',
                          height: '44px',
                          boxSizing: 'border-box',
                          border: 'none',
                          padding: '0px',
                          display: 'inline-block',
                          flex: 'auto',
                          borderRadius: '21px',
                        },
                        children: [
                          {
                            type: 'label',
                            dataKey: 'itemObject.key',
                            style: {
                              width: '44px',
                              height: '44px',
                              border: '1px solid black',
                              borderRadius: '21px',
                              lineHeight: '44px',
                              backgroundColor: '0xffffff',
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
              {
                type: 'view',
                style: {
                  width: '1',
                  display: 'flex',
                  justifyContent: 'center',
                  height: '0.4',
                  top: '0.1',
                },
                viewTag: 'calendar',
                children: [
                  {
                    type: 'list',
                    contentType: 'listObject',
                    listObject: '..calendarDate.dayLable',
                    iteratorVar: 'itemObject',
                    style: {
                      width: '320px',
                      display: 'flex',
                      height: '300px',
                      backgroundColor: '0x000000',
                      justifyContent: 'space-between',
                    },
                    children: [
                      {
                        type: 'listItem',
                        itemObject: '',
                        style: {
                          top: '0',
                          width: '44px',
                          height: '44px',
                          boxSizing: 'border-box',
                          border: 'none',
                          padding: '0px',
                          display: 'inline-block',
                          flex: 'auto',
                          borderRadius: '21px',
                        },
                        onClick: [
                          {
                            emit: {
                              dataKey: {
                                var: 'itemObject',
                              },
                              actions: [
                                {
                                  '=.builtIn.string.concat': {
                                    dataIn: [
                                      '=..calendarDate.year',
                                      '-',
                                      '=..calendarDate.month',
                                      '-',
                                      '$var.key',
                                    ],
                                    dataOut:
                                      'AppointmentSchedule.calendarDate.todayDate',
                                  },
                                },
                                {
                                  '=.builtIn.date.getTimeStampOfDate': {
                                    dataIn: {
                                      date: '=..calendarDate.todayDate',
                                    },
                                    dataOut:
                                      'AppointmentSchedule.calendarDate.todayStamp',
                                  },
                                },
                                {
                                  '=.builtIn.string.concat': {
                                    dataIn: [
                                      'stime>',
                                      '=..calendarDate.todayStamp.start',
                                      ' AND ',
                                      'etime<',
                                      '=..calendarDate.todayStamp.end',
                                    ],
                                    dataOut: 'Global.scheduleScondition',
                                  },
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
                          '..schedule.get',
                          {
                            actionType: 'builtIn',
                            funcName: 'redraw',
                            viewTag: 'todatDate',
                          },
                          {
                            actionType: 'builtIn',
                            funcName: 'redraw',
                            viewTag: 'schedule',
                          },
                        ],
                        children: [
                          {
                            type: 'label',
                            dataKey: 'itemObject.key',
                            style: {
                              width: '44px',
                              height: '44px',
                              borderRadius: '21px',
                              display: 'block',
                              lineHeight: '44px',
                              backgroundColor: 'itemObject.backgroundColor',
                              color: 'itemObject.color',
                              zIndex: '100',
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
                    type: 'label',
                    text: 'Selected:',
                    style: {
                      width: '0.15',
                      height: '44px',
                      left: '0.37',
                      top: '250px',
                      border: 'none',
                      lineHeight: '30px',
                      textAlign: {
                        y: 'center',
                      },
                    },
                  },
                  {
                    type: 'label',
                    viewTag: 'todatDate',
                    dataKey: 'calendarDate.todayDate',
                    style: {
                      width: '0.3',
                      left: '0.57',
                      height: '44px',
                      top: '250px',
                      lineHeight: '30px',
                      color: '#538dc7',
                      textAlign: {
                        y: 'center',
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
              width: '1',
              left: '0',
              height: '0.8',
              top: '0.55',
            },
            viewTage: 'schedule',
            children: [
              {
                type: 'list',
                contentType: 'listObject',
                listObject: '..schedule.scheduleList.edge',
                iteratorVar: 'itemObject',
                style: {
                  top: '0',
                  left: '0',
                  width: '1',
                  height: '0.8',
                  boxShadow: '0px 0px 1px #888888',
                },
                children: [
                  {
                    type: 'listItem',
                    itemObject: '',
                    style: {
                      left: '0',
                      top: '0',
                      width: '1',
                      height: '36px',
                      border: 'none',
                      borderBottom: '1px solid',
                      borderColor: '0x00000022',
                      borderWidth: '1',
                    },
                    onClick: [
                      {
                        actionType: 'updateObject',
                        dataKey: 'Global.DocReference.document',
                        dataObject: 'itemObject',
                      },
                    ],
                    children: [
                      {
                        type: 'label',
                        'text=func': '.builtIn.date.stampToTime',
                        dataKey: 'itemObject.stime',
                        style: {
                          width: '0.3',
                          height: '36px',
                          lineHeight: '36px',
                          top: '0',
                          left: '0',
                          fontSize: '13',
                          color: '0x000000',
                          border: 'none',
                          borderRight: '1px solid white',
                          borderColor: '0xffffff',
                          textAlign: {
                            x: 'center',
                          },
                        },
                      },
                      {
                        type: 'view',
                        style: {
                          width: '0.005',
                          height: '30px',
                          left: '0.3',
                          top: '3px',
                          backgroundColor: '0xd0d0d0',
                        },
                      },
                      {
                        type: 'label',
                        dataKey: 'itemObject.name.roomName',
                        style: {
                          width: '0.69',
                          height: '36px',
                          left: '0.3',
                          top: '0',
                          fontSize: '14',
                          color: '0x000000',
                          paddingLeft: '30px',
                          textAlign: {
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
        ],
      },
    ],
  },
}
