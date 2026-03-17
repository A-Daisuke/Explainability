    const notifyParentWindowThatPlayerAuthIsReady = (
      runtimeScene: gdjs.RuntimeScene
    ) => {
      if (getPlayerAuthPlatform(runtimeScene) !== 'games-platform') {
        // Automatic authentication is only valid when the game is hosted on GDevelop games platform.
        return;
      }

      logger.info(
        'Notifying parent window that player authentication is ready.'
      );
      window.parent.postMessage(
        {
          id: 'playerAuthReady',
        },
        '*' // We could restrict to GDevelop games platform but it's not necessary as the message is not sensitive, and it allows easy debugging.
      );

      // If no answer after 3 seconds, assume that the game is not embedded in GDevelop games platform, and remove the listener.
      _automaticGamesPlatformAuthenticationTimeoutId = setTimeout(() => {
        logger.info(
          'Removing automatic games platform authentication listener.'
        );
        removeAutomaticGamesPlatformAuthenticationCallback();
      }, 3000);
    };
