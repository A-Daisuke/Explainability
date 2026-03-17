function __method_wrapper__() {
      return new Promise((resolve, reject) => {
        if (typeof options === "string") {
          options = {
            url: options,
            title: ""
          };
        }

        if (!options.clientId) {
          // "无效的下载服务器"
          reject(this.t("invalidDownloadServer"));
          return;
        }

        options.savePath = PTService.pathHandler.getSavePath(
          options.savePath,
          PTService.site
        );
        if (options.savePath === false) {
          // "用户取消操作"
          reject(this.t("userCanceled"));
          return;
        }

        let notice = null;
        if (showNotice) {
          notice = PTService.showNotice({
            type: "info",
            timeout: 2,
            indeterminate: true,
            msg: this.t("sendingTorrent") //"正在发送下载链接到服务器，请稍候……"
          });
        }

        PTService.call(PTService.action.sendTorrentToClient, options)
          .then(result => {
            console.log("命令执行完成", result);
            if (showNotice) {
              PTService.showNotice(result);
            }
            resolve(result);
          })
          .catch(result => {
            // PTService.showNotice({
            //   msg: (result && result.msg) || result
            // });
            reject(result);
          })
          .finally(() => {
            this.hideNotice(notice);
          });
      });

}
