function __method_wrapper__() {
    this.autoRefreshUserDataTimer = window.setInterval(() => {
      let time = new Date().getTime();

      if (
        this.options.autoRefreshUserDataNextTime &&
        time >= this.options.autoRefreshUserDataNextTime &&
        !this.autoRefreshUserDataIsWorking
      ) {
        this.options.autoRefreshUserDataNextTime = this.getNextTime();
        this.autoRefreshUserDataIsWorking = true;
        this.controller.userService
          .refreshUserData(this.autoRefreshUserDataFailedCount > 0)
          .then((results: any) => {
            this.debug("refreshUserData DONE.", results);
            this.autoRefreshUserDataIsWorking = false;
            let haveError = false;
            results.some((result: any) => {
              if (!result) {
                haveError = true;
                return true;
              }

              if (!result.id) {
                if (
                  result.msg &&
                  result.msg.status != EUserDataRequestStatus.notSupported
                ) {
                  haveError = true;
                  return true;
                }
              }
            });

            if (haveError) {
              // 失败重试
              if (this.autoRefreshUserDataFailedCount < failedRetryCount) {
                // 设置几分钟后重试
                this.options.autoRefreshUserDataNextTime =
                  new Date().getTime() + failedRetryInterval * 60000;
                this.debug(
                  "数据刷新失败, 下次重试时间",
                  new Date(
                    this.options.autoRefreshUserDataNextTime as number
                  ).toLocaleString()
                );
              } else {
                this.debug("数据刷新失败, 重试次数已超限制");
              }
              this.autoRefreshUserDataFailedCount++;
            } else {
              this.debug("数据刷新完成");
              this.autoRefreshUserDataFailedCount = 0;
            }
          });
      }
    }, 1000);

}
