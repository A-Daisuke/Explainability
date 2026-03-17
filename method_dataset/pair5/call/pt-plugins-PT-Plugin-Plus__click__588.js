function __method_wrapper__() {
        click: (success, error) => {
          // getDownloadURL 方法有继承者提供
          if (!this.getDownloadURL) {
            // "getDownloadURL 方法未定义"
            error(this.t("getDownloadURLisUndefined"));
            return;
          }

          console.log(PTService.site, this.defaultPath);
          let url = this.getDownloadURL();

          if (!url) {
            // "获取下载链接失败"
            error(this.t("getDownloadURLFailed"));
            return;
          }

          PTService.call(PTService.action.copyTextToClipboard, url)
            .then(result => {
              console.log("命令执行完成", result);
              success();
            })
            .catch(result => {
              error(result);
            });
        }

}
