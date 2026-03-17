function __method_wrapper__() {
        click: (success, error) => {
          if (checkPasskey && !PTService.site.passkey) {
            error(this.t("needPasskey"));
            return;
          }
          let urls = this.getDownloadURLs();

          if (!urls.length || typeof urls == "string") {
            error(urls);
            return;
          }

          PTService.call(PTService.action.copyTextToClipboard, urls.join("\n"))
            .then(result => {
              console.log("命令执行完成", result);
              success();
            })
            .catch(() => {
              error();
            });
        },

}
