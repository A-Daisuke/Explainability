function __method_wrapper__() {
      new Promise<AuthenticationWindowStatus>((resolve) => {
        // First, clear the automatic authentication timeout.
        // It can still exist if the user triggers a log-in manually, while the automatic authentication is still waiting.
        removeAutomaticGamesPlatformAuthenticationCallback();

        // Listen to messages posted by the authentication window, so that we can
        // know when the user is authenticated.
        _authenticationMessageCallback = (event: MessageEvent) => {
          receiveAuthenticationMessage({
            runtimeScene,
            event,
            checkOrigin: true,
            onDone: resolve,
          });
        };
        window.addEventListener(
          'message',
          _authenticationMessageCallback,
          true
        );

        // Login dialog will be handled by the platform.
        window.parent.postMessage(
          {
            id: 'openGameAuthenticationDialog',
            gameId,
            disableGuestLogin: authWindowOptions.disableGuestLogin,
          },
          '*' // We could restrict to GDevelop games platform but it's not necessary as the message is not sensitive, and it allows easy debugging.
        );
      });

}
