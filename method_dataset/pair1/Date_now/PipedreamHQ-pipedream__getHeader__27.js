function __method_wrapper__() {
    getHeader(method, path, parameters) {
      const timestamp = Date.now();
      const queryString = method === "GET" || method === "DELETE" ?
        ((parameters)
          ? "?" + querystring.stringify(parameters)
          : "") :
        ((parameters)
          ? JSON.stringify(parameters)
          : "");
      return {
        "Content-Type": "application/json",
        "KC-API-KEY": this._apiKey(),
        "KC-API-TIMESTAMP": timestamp,
        "KC-API-PASSPHRASE": this._encryptBase64(this._passphrase()),
        "KC-API-SIGN": this._encryptBase64(timestamp + method + path + queryString),
        "KC-API-KEY-VERSION": 2,
      };
    },

}
