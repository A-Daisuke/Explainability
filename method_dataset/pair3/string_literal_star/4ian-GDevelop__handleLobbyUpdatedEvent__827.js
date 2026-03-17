    const handleLobbyUpdatedEvent = function ({
      runtimeScene,
      positionInLobby,
    }: {
      runtimeScene: gdjs.RuntimeScene;
      positionInLobby: number;
    }) {
      // This is mainly useful when joining a lobby, or when the lobby is updated before the game starts.
      // The position in lobby should never change after the game has started (the WS is closed anyway).
      playerNumber = positionInLobby;

      // If the player is in the lobby, tell the lobbies window that the lobby has been updated,
      // as well as the player position.
      const lobbiesIframe =
        gdjs.multiplayerComponents.getLobbiesIframe(runtimeScene);

      if (!lobbiesIframe || !lobbiesIframe.contentWindow) {
        return;
      }

      lobbiesIframe.contentWindow.postMessage(
        {
          id: 'lobbyUpdated',
          positionInLobby,
        },
        '*' // We could restrict to GDevelop games platform but it's not necessary as the message is not sensitive, and it allows easy debugging.
      );
    };
