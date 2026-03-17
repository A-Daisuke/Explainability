function __method_wrapper__() {
    async _refreshAccessToken(refreshToken) {
        const debugName = `#_refreshAccessToken(${refreshToken.substring(0, 5)}...)`;
        this._debug(debugName, 'begin');
        try {
            const startedAt = Date.now();
            // will attempt to refresh the token with exponential backoff
            return await (0, helpers_1.retryable)(async (attempt) => {
                if (attempt > 0) {
                    await (0, helpers_1.sleep)(200 * Math.pow(2, attempt - 1)); // 200, 400, 800, ...
                }
                this._debug(debugName, 'refreshing attempt', attempt);
                return await (0, fetch_1._request)(this.fetch, 'POST', `${this.url}/token?grant_type=refresh_token`, {
                    body: { refresh_token: refreshToken },
                    headers: this.headers,
                    xform: fetch_1._sessionResponse,
                });
            }, (attempt, error) => {
                const nextBackOffInterval = 200 * Math.pow(2, attempt);
                return (error &&
                    (0, errors_1.isAuthRetryableFetchError)(error) &&
                    // retryable only if the request can be sent before the backoff overflows the tick duration
                    Date.now() + nextBackOffInterval - startedAt < AUTO_REFRESH_TICK_DURATION);
            });
        }
        catch (error) {
            this._debug(debugName, 'error', error);
            if ((0, errors_1.isAuthError)(error)) {
                return { data: { session: null, user: null }, error };
            }
            throw error;
        }
        finally {
            this._debug(debugName, 'end');
        }
    }

}
