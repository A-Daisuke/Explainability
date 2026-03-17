function __method_wrapper__() {
      _websocket.onclose = () => {
        if (!_isLobbyGameRunning) {
          logger.info('Disconnected from the lobby.');
        }

        _connectionId = null;
        _websocket = null;
        if (_websocketHeartbeatIntervalFunction) {
          clearInterval(_websocketHeartbeatIntervalFunction);
        }

        // If the game is running, then all good.
        // Otherwise, the player left the lobby.
        if (_isLobbyGameRunning) {
          return;
        }

        const lobbiesIframe =
          gdjs.multiplayerComponents.getLobbiesIframe(runtimeScene);

        if (!lobbiesIframe || !lobbiesIframe.contentWindow) {
          return;
        }

        // Tell the Lobbies iframe that the lobby has been left.
        lobbiesIframe.contentWindow.postMessage(
          {
            id: 'lobbyLeft',
          },
          '*' // We could restrict to GDevelop games platform but it's not necessary as the message is not sensitive, and it allows easy debugging.
        );
      };

}
