function __method_wrapper__() {
    (gameId: string) => {
      if (iframeLoaded) {
        // $FlowFixMe - we know it's an iframe.
        const iframe: ?HTMLIFrameElement = document.getElementById(
          GAMES_PLATFORM_IFRAME_ID
        );
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            {
              id: 'openGame',
              gameId,
            },
            '*'
          );
        }
      }
    },

}
