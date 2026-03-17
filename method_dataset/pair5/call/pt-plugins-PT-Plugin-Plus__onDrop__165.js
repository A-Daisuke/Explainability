function __method_wrapper__() {
        onDrop: (data, event, success, error) => {
          if (checkPasskey && !PTService.site.passkey) {
            error(this.t("needPasskey"));
            return;
          }
          let url = this.getDroperURL(data.url);
          url &&
            PTService.call(PTService.action.copyTextToClipboard, url)
              .then(result => {
                console.log("命令执行完成", result);
                success();
              })
              .catch(() => {
                error();
              });
        }

}
