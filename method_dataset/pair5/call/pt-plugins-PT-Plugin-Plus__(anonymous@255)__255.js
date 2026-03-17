function __method_wrapper__() {
      return new Promise((resolve, reject) => {
        if (typeof option === "string") {
          option = {
            url: option,
            title: ""
          };
        }

        let savePath = PTService.pathHandler.getSavePath(
          this.defaultPath,
          PTService.site
        );

        if (savePath === false) {
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

        PTService.call(PTService.action.sendTorrentToDefaultClient, {
          url: option.url,
          title: option.title,
          savePath: savePath,
          autoStart: this.defaultClientOptions.autoStart,
          tagIMDb: this.defaultClientOptions.tagIMDb,
          link: option.link,
          imdbId: option.imdbId
        })
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
