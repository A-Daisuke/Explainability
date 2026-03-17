function __method_wrapper__() {
        startSaving({
          playerName,
          playerId,
          score,
        }: {
          playerName?: string;
          playerId?: string;
          score: number;
        }): {
          closeSaving: (leaderboardEntry: PublicLeaderboardEntry) => void;
          closeSavingWithError(errorCode: string);
        } {
          if (this._isAlreadySavingThisScore({ playerName, playerId, score })) {
            logger.warn(
              'There is already a request to save with this player name and this score. Ignoring this one.'
            );
            throw new Error('Ignoring this saving request.');
          }

          if (this._isSameAsLastScore({ playerName, playerId, score })) {
            logger.warn(
              'The player and score to be sent are the same as previous one. Ignoring this one.'
            );
            this._setError('SAME_AS_PREVIOUS');
            throw new Error('Ignoring this saving request.');
          }

          if (this._wouldExceedPerLeaderboardTentativeRateLimit()) {
            logger.warn(
              'Last entry was sent too little time ago. Ignoring this one.'
            );
            this._setError('TOO_FAST');

            // Set the starting time to cancel all the following attempts that
            // are started too early after this one.
            this.lastScoreSavingStartedAt = Date.now();

            throw new Error('Ignoring this saving request.');
          }

          // Rolling window rate limiting check for successful entries.
          if (wouldExceedGlobalSuccessRateLimit()) {
            logger.warn(
              'Rate limit exceeded. Too many entries have been successfully sent recently across all leaderboards. Ignoring this one.'
            );
            this._setError('GLOBAL_RATE_LIMIT_EXCEEDED');

            throw new Error('Ignoring this saving request.');
          }
          if (this._wouldExceedPerLeaderboardSuccessRateLimit()) {
            logger.warn(
              'Rate limit exceeded. Too many entries have been successfully sent recently for this leaderboard. Ignoring this one.'
            );
            this._setError('LEADERBOARD_RATE_LIMIT_EXCEEDED');

            throw new Error('Ignoring this saving request.');
          }

          let resolveSavingPromise: () => void;
          const savingPromise = new Promise<void>((resolve) => {
            resolveSavingPromise = resolve;
          });

          this.lastScoreSavingStartedAt = Date.now();
          this.lastSavingPromise = savingPromise;
          this.hasScoreBeenSaved = false;
          this.hasScoreSavingErrored = false;
          this._currentlySavingScore = score;
          if (playerName) this._currentlySavingPlayerName = playerName;
          if (playerId) this._currentlySavingPlayerId = playerId;

          return {
            closeSaving: (leaderboardEntry) => {
              // Record successful entry for rolling window rate limiting.
              this._recordPerLeaderboardAndGlobalSuccessfulEntry();

              if (savingPromise !== this.lastSavingPromise) {
                logger.info(
                  'Score saving result received, but another save was launched in the meantime - ignoring the result of this one.'
                );

                // Still finish the promise that can be waited upon:
                resolveSavingPromise();
                return;
              }

              this.lastScoreSavingSucceededAt = Date.now();
              this._lastSavedScore = this._currentlySavingScore;
              this._lastSavedPlayerName = this._currentlySavingPlayerName;
              this._lastSavedPlayerId = this._currentlySavingPlayerId;
              this.lastSavedLeaderboardEntry = leaderboardEntry;
              this.hasScoreBeenSaved = true;

              resolveSavingPromise();
            },
            closeSavingWithError: (errorCode) => {
              if (savingPromise !== this.lastSavingPromise) {
                logger.info(
                  'Score saving result received, but another save was launched in the meantime - ignoring the result of this one.'
                );

                // Still finish the promise that can be waited upon:
                resolveSavingPromise();
                return;
              }

              this._setError(errorCode);
              resolveSavingPromise();
            },
          };
        }

}
