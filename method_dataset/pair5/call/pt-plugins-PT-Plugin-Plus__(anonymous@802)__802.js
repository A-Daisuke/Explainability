function __method_wrapper__() {
      (e: any) => {
        //console.log(e);
        e.stopPropagation();
        e.preventDefault();
        this.hideDroper();

        // 获取未处理的地址
        try {
          let data = JSON.parse(e.dataTransfer.getData("text/plain"));
          if (data) {
            if (data.url) {
              // IMDb地址
              let IMDbMatch = data.url.match(/imdb\.com\/title\/(tt\d+)/);
              if (IMDbMatch && IMDbMatch.length > 1) {
                this.extension.sendRequest(
                  EAction.openOptions,
                  null,
                  `search-torrent/${IMDbMatch[1]}`
                );
                this.logo.removeClass("pt-plugin-onLoading");
                return;
              }
              if (this.pageApp) {
                this.pageApp
                  .call(EAction.downloadFromDroper, data)
                  .then(() => {
                    this.logo.removeClass("pt-plugin-onLoading");
                  })
                  .catch(() => {
                    this.logo.removeClass("pt-plugin-onLoading");
                  });
              } else {
                this.showNotice({
                  type: EDataResultType.info,
                  msg: i18n.t("notSupported"), // "当前页面不支持此操作",
                  timeout: 3
                });
                this.logo.removeClass("pt-plugin-onLoading");
              }
            } else {
              this.logo.removeClass("pt-plugin-onLoading");
            }
          }
        } catch (error) {
          this.logo.removeClass("pt-plugin-onLoading");
        }
      },

}
