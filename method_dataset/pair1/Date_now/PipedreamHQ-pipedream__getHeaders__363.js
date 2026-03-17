class __C__ {
    getHeaders(args = {}) {
      const {
        secret_key: secretKey,
        api_key: apiKey,
        secret_passphrase: secretPassphrase,
        demo_environment: demoEnvironment,
      } = this.$auth;

      const timestamp = Date.now();

      const message = this.preHash({
        timestamp,
        ...args,
      });
      console.log("message!!!", message);

      const signature = this.sign(message, secretKey);
      const paptrading = demoEnvironment ?
        "1" :
        "0";

      return {
        "ACCESS-KEY": apiKey,
        "ACCESS-PASSPHRASE": secretPassphrase,
        "ACCESS-TIMESTAMP": timestamp,
        "ACCESS-SIGN": signature,
        paptrading,
        "locale": "en-US",
        "Content-Type": "application/json",
      };
    },

}
