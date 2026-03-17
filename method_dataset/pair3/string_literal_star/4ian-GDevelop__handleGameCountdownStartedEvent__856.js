    const handleGameCountdownStartedEvent = function ({
      runtimeScene,
      compressionMethod,
    }: {
      runtimeScene: gdjs.RuntimeScene;
      compressionMethod: gdjs.multiplayerPeerJsHelper.CompressionMethod;
    }) {
      gdjs.multiplayerPeerJsHelper.setCompressionMethod(compressionMethod);

      // When the countdown starts, if we are player number 1, we are chosen as the host.
      // We then send the peerId to others so they can connect via P2P.
      // TODO: this should be sent by the backend, in case the lobby starts without a player 1.
      if (getCurrentPlayerNumber() === 1) {
        sendPeerId();
      }

      // Just pass along the message to the iframe so that it can display the countdown.
      const lobbiesIframe =
        gdjs.multiplayerComponents.getLobbiesIframe(runtimeScene);

      if (!lobbiesIframe || !lobbiesIframe.contentWindow) {
        logger.info('The lobbies iframe is not opened, not sending message.');
        return;
      }

      lobbiesIframe.contentWindow.postMessage(
        {
          id: 'gameCountdownStarted',
        },
        '*' // We could restrict to GDevelop games platform but it's not necessary as the message is not sensitive, and it allows easy debugging.
      );

      // Prevent the player from leaving the lobby while the game is starting.
      gdjs.multiplayerComponents.hideLobbiesCloseButtonTemporarily(
        runtimeScene
      );
    };
