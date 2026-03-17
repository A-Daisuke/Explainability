function __method_wrapper__() {
    async setAuth(token = null) {
        let tokenToSend = token ||
            (this.accessToken && (await this.accessToken())) ||
            this.accessTokenValue;
        if (tokenToSend) {
            let parsed = null;
            try {
                parsed = JSON.parse(atob(tokenToSend.split('.')[1]));
            }
            catch (_error) { }
            if (parsed && parsed.exp) {
                let now = Math.floor(Date.now() / 1000);
                let valid = now - parsed.exp < 0;
                if (!valid) {
                    this.log('auth', `InvalidJWTToken: Invalid value for JWT claim "exp" with value ${parsed.exp}`);
                    return Promise.reject(`InvalidJWTToken: Invalid value for JWT claim "exp" with value ${parsed.exp}`);
                }
            }
            this.accessTokenValue = tokenToSend;
            this.channels.forEach((channel) => {
                tokenToSend && channel.updateJoinPayload({ access_token: tokenToSend });
                if (channel.joinedOnce && channel._isJoined()) {
                    channel._push(constants_1.CHANNEL_EVENTS.access_token, {
                        access_token: tokenToSend,
                    });
                }
            });
        }
    }

}
