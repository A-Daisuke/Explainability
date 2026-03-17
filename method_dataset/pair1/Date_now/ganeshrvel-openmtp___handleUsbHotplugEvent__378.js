function __method_wrapper__() {
  _handleUsbHotplugEvent = async (_, { device, eventName }) => {
    const {
      mtpDevice,
      actionCreateReloadDirList,
      currentBrowsePath,
      deviceType,
      hideHiddenFiles,
      enableUsbHotplug,
      mtpMode,
    } = this.props;

    checkIf(device, 'string');
    checkIf(eventName, 'inObjectValues', USB_HOTPLUG_EVENTS);
    checkIf(mtpMode, 'inObjectValues', MTP_MODE);

    checkIf(actionCreateReloadDirList, 'function');
    checkIf(currentBrowsePath, 'object');
    checkIf(deviceType, 'inObjectValues', DEVICE_TYPE);
    checkIf(hideHiddenFiles, 'object');

    try {
      if (isEmpty(device) || isEmpty(eventName)) {
        return;
      }

      const _usbDeviceInfo = JSON.parse(device);

      analyticsService.sendEvent(EVENT_TYPE.MTP_USB_HOTPLUG_RECEIVED, {
        manufacturer: _usbDeviceInfo.manufacturer,
        deviceName: _usbDeviceInfo.deviceName,
        productId: _usbDeviceInfo.productId,
        vendorId: _usbDeviceInfo.vendorId,
        eventName,
      });

      // if the mtp mode is not kalam then dont proceed.
      if (mtpMode !== MTP_MODE.kalam) {
        return;
      }

      if (!enableUsbHotplug) {
        return;
      }

      // if [this.usbHotplug] is null then set the object
      if (!this.usbHotplug) {
        this.usbHotplug = {
          attempts: 1,
          lastAttempted: Date.now(),
        };
      } else {
        // if the last attempt to connect the device was made more than [USB_HOTPLUG_MAX_ATTEMPTS_TIMEOUT] milliseconds ago then reset the attempts counter
        if (
          Date.now() - this.usbHotplug.lastAttempted >=
          USB_HOTPLUG_MAX_ATTEMPTS_TIMEOUT
        ) {
          this.usbHotplug = {
            // update the number of attempts
            attempts: 0,
            lastAttempted: Date.now(),
          };
        }

        // check for the number of connect attempts
        // if the number of connect attempts are greater than [USB_HOTPLUG_MAX_ATTEMPTS]
        // and if the [lastAttempted] and was made within [USB_HOTPLUG_MAX_ATTEMPTS_TIMEOUT] then don't connect
        else if (
          this.usbHotplug.attempts > USB_HOTPLUG_MAX_ATTEMPTS &&
          Date.now() - this.usbHotplug.lastAttempted <
            USB_HOTPLUG_MAX_ATTEMPTS_TIMEOUT
        ) {
          return;
        }

        // update the number of attempts
        this.usbHotplug.attempts += 1;
      }

      switch (eventName) {
        case USB_HOTPLUG_EVENTS.detach:
          // if an usb device was detached and mtp device is disconnected then
          // try to disconnect the mtp device
          if (mtpDevice.isAvailable) {
            // check to see if the detached usb device was the connected mtp device itself
            if (
              _usbDeviceInfo.serialNumber ===
              mtpDevice?.info?.usbDeviceInfo?.SerialNumber
            ) {
              analyticsService.sendEvent(EVENT_TYPE.MTP_USB_HOTPLUG_DETTACHED, {
                manufacturer: _usbDeviceInfo.manufacturer,
                deviceName: _usbDeviceInfo.deviceName,
                productId: _usbDeviceInfo.productId,
                vendorId: _usbDeviceInfo.vendorId,
                eventName,
              });

              actionCreateReloadDirList({
                filePath: currentBrowsePath[deviceType],
                ignoreHidden: hideHiddenFiles[deviceType],
                deviceType,
              });
            }
          }

          break;

        case USB_HOTPLUG_EVENTS.attach:
        default:
          // if an usb device was attached and mtp device is connected then
          // try to connect the mtp device
          if (!mtpDevice.isAvailable) {
            analyticsService.sendEvent(EVENT_TYPE.MTP_USB_HOTPLUG_ATTACHED, {
              manufacturer: _usbDeviceInfo.manufacturer,
              deviceName: _usbDeviceInfo.deviceName,
              productId: _usbDeviceInfo.productId,
              vendorId: _usbDeviceInfo.vendorId,
              eventName,
            });

            actionCreateReloadDirList({
              filePath: currentBrowsePath[deviceType],
              ignoreHidden: hideHiddenFiles[deviceType],
              deviceType,
            });
          }

          break;
      }
    } catch (e) {
      log.error(e, 'FileExplorer._handleUsbHotplugEvent');
    }
  };

}
