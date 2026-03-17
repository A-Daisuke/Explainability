function __method_wrapper__() {
    initFreeSpaceButton() {
      if (!this.defaultPath) {
        return;
      }
      PTService.call(PTService.action.getFreeSpace, {
        path: this.defaultPath,
        clientId: PTService.site.defaultClientId
      })
        .then(result => {
          console.log("命令执行完成", result);
          if (result && result.arguments) {
            // console.log(PTService.filters.formatSize(result.arguments["size-bytes"]));

            PTService.addButton({
              title: this.t("buttons.freeSpaceTip", {
                path: this.defaultPath,
                interpolation: { escapeValue: false }
              }), // "默认服务器剩余空间\n" + this.defaultPath,
              icon: "filter_drama",
              label: PTService.filters.formatSize(
                result.arguments["size-bytes"]
              )
            });
          }
          // success();
        })
        .catch(() => {
          // error()
        });
    }

}
