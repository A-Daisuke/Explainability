function __method_wrapper__() {
    async () => {
      if (!iframeLoaded) {
        return;
      }

      // The iframe is loaded:
      // we can now sent the information that the user is connected,
      // to automatically log the user in the frame,
      // or notify it the user is not connected (or just disconnected).

      // $FlowFixMe - we know it's an iframe.
      const iframe: ?HTMLIFrameElement = document.getElementById(
        GAMES_PLATFORM_IFRAME_ID
      );
      if (!iframe || !iframe.contentWindow) {
        console.error('Iframe not found or not accessible.');
        return;
      }

      try {
        if (userCustomToken) {
          console.info('Sending user custom token to Games Platform frame...');
          iframe.contentWindow.postMessage(
            {
              id: 'connectUserWithCustomToken',
              token: userCustomToken,
            },
            // Specify the target origin to avoid leaking the customToken.
            // Use '*' to test locally.
            Window.isDev() ? '*' : 'https://gd.games'
          );
        } else {
          console.info(
            'Notifying the Games Platform frame that the user is not connected (or just disconnected).'
          );
          iframe.contentWindow.postMessage(
            {
              id: 'disconnectUser',
            },
            // No need to specify the target origin, as this info is not sensitive.
            '*'
          );
        }
      } catch (error) {
        console.error(
          'Error while sending user custom token. User will not be logged in the Games Platform frame.',
          error
        );
        return;
      }
    },

}
