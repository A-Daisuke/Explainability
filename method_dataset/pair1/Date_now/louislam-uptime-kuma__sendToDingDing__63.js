class __C__ {
    async sendToDingDing(notification, params) {
        let timestamp = Date.now();

        let config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            url: `${notification.webHookUrl}&timestamp=${timestamp}&sign=${encodeURIComponent(this.sign(timestamp, notification.secretKey))}`,
            data: JSON.stringify(params),
        };
        config = this.getAxiosConfigWithProxy(config);

        let result = await axios(config);
        if (result.data.errmsg === "ok") {
            return true;
        }
        throw new Error(result.data.errmsg);
    }

}
