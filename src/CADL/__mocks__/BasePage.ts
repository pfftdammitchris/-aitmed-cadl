export default {
  BasePage: {
    pageNumber: '0',
  },
  HeaderTitle2: {
    type: 'label',
    text: '=..title',
    style: {
      left: '0.3',
      top: '0.03',
      width: '0.4',
      fontWeight: 300,
      height: '0.04',
      fontSize: '14',
      color: '0xFFFFFF',
      textAlign: {
        x: 'center',
      },
    },
  },
  RightCancelButton: {
    type: 'button',
    text: 'Cancel',
    style: {
      color: '0xFFFFFF',
      fontSize: '12',
      left: '0.75',
      top: '0.02',
      fontWeight: 300,
      width: '0.25',
      height: '0.054',
      backgroundColor: '0x388ecc',
      onClick: [
        {
          goto: 'DisplayProfile',
        },
      ],
    },
  },
  RightEditButton: {
    type: 'button',
    text: 'Edit',
    style: {
      color: '0xFFFFFF',
      fontSize: '12',
      left: '0.75',
      top: '0.02',
      fontWeight: 300,
      width: '0.25',
      height: '0.054',
      backgroundColor: '0x388ecc',
      onClick: [
        {
          goto: 'EditProfile',
        },
      ],
    },
  },
  RightShareButton: {
    type: 'button',
    text: 'Share',
    style: {
      color: '0xFFFFFF',
      fontSize: '12',
      left: '0.75',
      top: '0.02',
      fontWeight: 300,
      width: '0.25',
      height: '0.054',
      backgroundColor: '0x388ecc',
      onClick: [
        {
          goto: 'EditProfile',
        },
      ],
    },
  },
  LeftBackButton: {
    type: 'button',
    onClick: [
      {
        actionType: 'builtIn',
        funcName: 'goBack',
      },
    ],
    style: {
      left: '0.03',
      top: '0.025',
      width: '0.15',
      height: '0.05',
      backgroundColor: '0x388eccff',
    },
    children: [
      {
        type: 'image',
        path: 'backWhiteArrow.png',
        style: {
          left: '0.02',
          top: '0.01',
          width: '0.04',
          height: '0.02',
        },
      },
      {
        type: 'label',
        text: 'Back',
        style: {
          left: '0.08',
          top: '0',
          width: '0.08',
          height: '0.04',
          fontSize: '12',
          color: '0xffffffff',
          textAlign: {
            x: 'left',
            y: 'center',
          },
        },
      },
    ],
  },
  MenuHeader: {
    type: 'view',
    style: {
      left: '0',
      top: '0',
      width: '1',
      height: '0.2',
      backgroundColor: '0x388eccff',
    },
    children: [
      {
        type: 'label',
        text: '=..title',
        style: {
          color: '0xffffffff',
          top: '0',
          left: '0.08',
          width: '0.7',
          height: '0.15',
          fontSize: '21',
          fontWeight: 400,
          zIndex: '1000',
          textAlign: {
            y: 'center',
          },
        },
      },
      {
        type: 'image',
        path: 'sideNav2.png',
        style: {
          left: '0.83',
          top: '0.06',
          height: '0.03',
        },
        onClick: [
          {
            goto: 'SideMenuBar',
          },
        ],
      },
    ],
  },
  SubMenuView: {
    type: 'view',
    style: {
      left: '0',
      top: '0.15',
      width: '1',
      height: '0.05',
    },
  },
  SubMenuButton: {
    type: 'button',
    text: 'Invited',
    style: {
      color: '0x9bc6e5ff',
      backgroundColor: '0x388eccff',
      fontSize: '18',
      left: '0',
      top: '0',
      width: '0.33',
      height: '0.05',
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
        goto: 'MeetingRoomInvited',
      },
    ],
  },
  WithCancelHeader: {
    type: 'header',
    style: {
      left: '0',
      top: '0',
      width: '1',
      height: '0.1',
      backgroundColor: '0x388eccff',
    },
    children: [
      {
        type: 'label',
        text: '=..title',
        style: {
          left: '0.35',
          width: '0.3',
          top: '0.032',
          fontWeight: 400,
          height: '0.1',
          fontSize: '19',
          color: '0xffffffff',
          textAlign: {
            x: 'center',
          },
        },
      },
      {
        type: 'label',
        text: 'Cancel',
        onClick: [
          {
            actionType: 'builtIn',
            funcName: 'goBack',
          },
        ],
        style: {
          left: '0.82',
          width: '0.18',
          height: '0.1',
          fontSize: '15',
          fontWeight: 300,
          color: '0xffffffff',
          textAlign: {
            y: 'center',
          },
        },
      },
    ],
  },
  BaseHeader3: {
    type: 'header',
    style: {
      left: '0',
      top: '0',
      width: '1',
      height: '0.1',
      backgroundColor: '0x388eccff',
    },
    children: [
      {
        type: 'label',
        text: '=..title',
        style: {
          left: '0.25',
          width: '0.5',
          top: '0.033',
          fontWeight: 400,
          height: '0.1',
          fontSize: '19',
          color: '0xffffffff',
          textAlign: {
            x: 'center',
          },
        },
      },
    ],
  },
  BaseHeader: {
    type: 'header',
    style: {
      left: '0',
      top: '0',
      width: '1',
      height: '0.1',
      backgroundColor: '0x388eccff',
    },
    children: [
      {
        type: 'button',
        text: '=..title',
        style: {
          left: '0.3',
          width: '0.4',
          top: '0',
          fontWeight: 300,
          backgroundColor: '0x388eccff',
          height: '0.1',
          fontSize: '18',
          color: '0xffffffff',
          textAlign: {
            x: 'center',
          },
        },
      },
    ],
  },
  HeaderRightButton: {
    type: 'label',
    style: '.HeaderRightLink',
  },
  HeaderLeftButton: {
    type: 'button',
    onClick: [
      {
        actionType: 'builtIn',
        funcName: 'goBack',
      },
    ],
    style: {
      top: '0',
      left: '0.03',
      width: '0.15',
      height: '0.1',
      backgroundColor: '0x388eccff',
      zIndex: 100,
      textAlign: {
        y: 'center',
      },
    },
    children: [
      {
        type: 'image',
        path: 'backWhiteArrow.png',
        style: {
          left: '0.02',
          top: '0.04',
          height: '0.02',
          zIndex: 100,
        },
        textAlign: {
          y: 'center',
        },
      },
      {
        type: 'label',
        text: 'Back',
        style: {
          left: '0.08',
          top: '0',
          height: '0.1',
          zIndex: 100,
          fontSize: '17',
          color: '0xffffffff',
          textAlign: {
            x: 'left',
            y: 'center',
          },
        },
      },
    ],
  },
  HeaderRightImg: {
    type: 'image',
    style: '.HeaderRightImgStyle',
  },
  SearchField: {
    type: 'textField',
    placeholder: '  Search Documents',
    contentType: 'text',
    style: {
      left: '0.08',
      width: '0.6',
      height: '0.03',
      backgroundColor: '0xE8E8E8',
      fontSize: '12',
      textAlign: {
        x: 'left',
        y: 'center',
      },
    },
  },
  SearchDoc: {
    type: 'button',
    text: 'Search',
    style: {
      backgroundColor: '0x388ecc',
      height: '0.03',
      color: '0xfff',
      width: '0.18',
    },
  },
  SuccessPopup: {
    type: 'popUp',
    viewTag: 'successPopUp',
    style: {
      width: '0.88',
      height: '0.3',
      top: '0.3',
      left: '0.06',
      zIndex: '100',
      backgroundColor: '0x00000066',
      borderRadius: '7',
    },
    children: [
      {
        type: 'image',
        path: 'successMark.png',
        style: {
          width: '0.2',
          left: '0.34',
          top: '0.05',
        },
      },
      {
        type: 'button',
        text: 'ok',
        style: {
          width: '0.6',
          left: '0.14',
          height: '0.05',
          top: '0.2',
          backgroundColor: '0x00000000',
          fontSize: '20',
          color: '0xffffff',
          border: {
            style: '1',
            color: '0x000000',
          },
        },
        onClick: [
          {
            actionType: 'popUpDismiss',
            popUpView: 'successPopUp',
          },
        ],
      },
    ],
  },
  UploadModule: {
    type: 'view',
    style: {
      width: '0.7',
      left: '0.15',
      height: '0.12',
      border: {
        style: '4',
        width: '1.5',
        color: '0xacacac',
      },
    },
    children: [
      {
        type: 'image',
        path: 'cloud.png',
        style: {
          height: '0.04',
          top: '0.04',
          left: '0.1',
        },
      },
      {
        type: 'label',
        text: 'Click here to upload',
        style: {
          width: '0.5',
          fontSize: '14',
          height: '0.12',
          left: '0.26',
          color: '0xacacac',
          textAlign: {
            y: 'center',
          },
        },
      },
    ],
  },
  BaseCheckView: {
    type: 'popUp',
    viewTag: 'baseCheckView',
    message: 'error code',
    style: {
      width: '0.88',
      height: '0.3',
      top: '0.3',
      left: '0.06',
      zIndex: '100',
      backgroundColor: '0xeaeaea',
      borderRadius: '7',
    },
    children: [
      {
        type: 'label',
        text: '_.message',
        text2: '.text3',
        text3: 'v',
        text4: '_.children.1.text',
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
        type: 'button',
        text: 'ok',
        style: {
          width: '0.6',
          left: '0.14',
          height: '0.05',
          top: '0.2',
          backgroundColor: '0x00000000',
          fontSize: '20',
          color: '0xffffff',
          border: {
            style: '1',
            color: '0x000000',
          },
        },
        onClick: [
          {
            actionType: 'popUpDismiss',
            popUpView: '___.viewTag',
          },
        ],
      },
    ],
  },
}
