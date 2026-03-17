function __method_wrapper__() {
  constructor(props) {
    super(props);

    this.mainWindowRendererProcess = getMainWindowRendererProcess();
    this.filesDragGhostImg = this._createDragIcon();

    this.initialState = {
      togglePasteConfirmDialog: false,
      toggleDialog: {
        rename: {
          errors: {
            toggle: false,
            message: null,
          },
          toggle: false,
          data: {},
        },
        newFolder: {
          errors: {
            toggle: false,
            message: null,
          },
          toggle: false,
          data: {},
        },
      },
      directoryGeneratedTime: Date.now(),
    };

    this.state = {
      ...this.initialState,
    };

    this.electronMenu = new Menu();

    this.keyedAcceleratorList = {
      shift: false,
    };

    this.usbHotplug = {
      attempts: 0,
      lastAttempted: Date.now(),
    };
  }

}
