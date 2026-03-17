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

          let downloads = [];
          urls.forEach(url => {
            downloads.push({
              url,
              method: PTService.site.downloadMethod
            });
          });

          console.log(downloads);

          PTService.call(PTService.action.addBrowserDownloads, downloads)
            .then(result => {
              console.log("命令执行完成", result);
              success();
            })
            .catch(e => {
              console.log(e);
              error(e);
            });
        }

}
