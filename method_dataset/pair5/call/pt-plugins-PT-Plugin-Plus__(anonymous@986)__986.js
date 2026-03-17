function __method_wrapper__() {
        .catch(() => {
          // 如果没有当前页面的选择器，则尝试获取通用的选择器
          this.call(EAction.getSiteSelectorConfig, {
            host: this.site.host,
            name: "common"
          })
            .then(result => {
              this.pageSelector = result;
              resolve();
            })
            .catch(() => {
              // 没有选择器
              resolve();
            });
        });

}
