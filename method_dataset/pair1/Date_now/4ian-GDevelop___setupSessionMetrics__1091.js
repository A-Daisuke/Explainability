function __method_wrapper__() {
    _setupSessionMetrics() {
      if (this._sessionMetricsInitialized) {
        return;
      }
      if (this._disableMetrics) {
        return;
      }
      if (this.isPreview()) {
        return;
      }
      if (typeof fetch === 'undefined') {
        return;
      }
      if (!this._data.properties.projectUuid) {
        return;
      }
      const baseUrl = 'https://api.gdevelop-app.com/analytics';
      this._playerId = this._makePlayerUuid();
      /**
       * The duration that is already sent to the service
       * (in milliseconds).
       **/
      let sentDuration = 0;
      /**
       * The duration that is not yet sent to the service to avoid flooding
       * (in milliseconds).
       **/
      let notYetSentDuration = 0;
      /**
       * The last time when duration has been counted
       * either in sendedDuration or notYetSentDuration.
       **/
      let lastSessionResumeTime = Date.now();
      const platform = this.getPlatformInfo();
      fetch(baseUrl + '/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // It's important to ensure that the data sent here does not contain
        // any personal information from the player or that would allow to
        // precisely identify someone.
        body: JSON.stringify({
          gameId: this._data.properties.projectUuid,
          playerId: this._playerId,
          game: {
            name: this._data.properties.name || '',
            packageName: this._data.properties.packageName || '',
            version: this._data.properties.version || '',
            location: window.location.href,
          },
          platform: {
            isCordova: platform.isCordova,
            devicePlatform: platform.devicePlatform,
            navigatorPlatform: platform.navigatorPlatform,
            hasTouch: platform.hasTouch,
          },
        }),
      })
        .then((response) => {
          // Ensure the session is correctly created to avoid sending hits that will fail.
          if (!response.ok) {
            console.error('Error while creating the session', response);
            throw new Error('Error while creating the session');
          }
          return response;
        })
        .then((response) => response.text())
        .then((returnedSessionId) => {
          this._sessionId = returnedSessionId;
        })
        .catch(() => {});

      /* Ignore any error */
      const sendSessionHit = () => {
        if (!this._sessionId) {
          return;
        }

        const now = Date.now();
        notYetSentDuration += now - lastSessionResumeTime;
        lastSessionResumeTime = now;

        // Group repeated calls to sendSessionHit - which could
        // happen because of multiple event listeners being fired.
        if (notYetSentDuration < 5 * 1000) {
          return;
        }
        // The backend use seconds for duration.
        // The milliseconds will stay in notYetSentDuration.
        const toBeSentDuration = Math.floor(notYetSentDuration / 1000) * 1000;
        sentDuration += toBeSentDuration;
        notYetSentDuration -= toBeSentDuration;

        navigator.sendBeacon(
          baseUrl + '/session-hit',
          JSON.stringify({
            gameId: this._data.properties.projectUuid,
            playerId: this._playerId,
            sessionId: this._sessionId,
            duration: Math.floor(sentDuration / 1000),
          })
        );
      };
      if (typeof navigator !== 'undefined' && typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            // Skip the duration the game was hidden.
            lastSessionResumeTime = Date.now();
          } else {
            sendSessionHit();
          }
        });
        window.addEventListener('pagehide', sendSessionHit, false);
        // Cordova events
        window.addEventListener('pause', sendSessionHit, false);
        window.addEventListener(
          'resume',
          () => {
            // Skip the duration the game was hidden.
            lastSessionResumeTime = Date.now();
          },
          false
        );

        // Detect Safari to work around Safari-specific bugs:
        // - https://bugs.webkit.org/show_bug.cgi?id=151610
        // - https://bugs.webkit.org/show_bug.cgi?id=151234
        // @ts-ignore
        const isSafari = typeof safari === 'object' && safari.pushNotification;
        const isElectron = /electron/i.test(navigator.userAgent);
        if (isSafari || isElectron) {
          window.addEventListener('beforeunload', () => {
            sendSessionHit();
          });
        }
      }
      this._sessionMetricsInitialized = true;
      this._sessionId = this._sessionId;
    }

}
