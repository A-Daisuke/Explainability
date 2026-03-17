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
