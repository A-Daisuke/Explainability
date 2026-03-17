    const sendSessionInformation = (runtimeScene: gdjs.RuntimeScene) => {
      const lobbiesIframe =
        gdjs.multiplayerComponents.getLobbiesIframe(runtimeScene);
      if (!lobbiesIframe || !lobbiesIframe.contentWindow) {
        // Cannot send the message if the iframe is not opened.
        return;
      }

      const platformInfo = runtimeScene.getGame().getPlatformInfo();

      lobbiesIframe.contentWindow.postMessage(
        {
          id: 'sessionInformation',
          isCordova: platformInfo.isCordova,
          devicePlatform: platformInfo.devicePlatform,
          navigatorPlatform: platformInfo.navigatorPlatform,
          hasTouch: platformInfo.hasTouch,
        },
        '*'
      );
    };
