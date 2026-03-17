function __method_wrapper__() {
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

}
