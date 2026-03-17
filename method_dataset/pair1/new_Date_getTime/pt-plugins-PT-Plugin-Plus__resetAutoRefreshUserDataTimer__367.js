function __method_wrapper__() {
  private resetAutoRefreshUserDataTimer(isInit: boolean = false) {
    clearInterval(this.autoRefreshUserDataTimer);
    if (!this.options.autoRefreshUserData) {
      return;
    }

    // 先尝试当天
    this.options.autoRefreshUserDataNextTime = this.getNextTime(0);
    // 如果当前下次获取时间小于当前时间，则设置为第二天
    if (new Date().getTime() >= this.options.autoRefreshUserDataNextTime) {
      // 初始化时，10 秒后获取数据
      if (isInit) {
        // 如果当天还没有获取过，就重新获取
        if (
          PPF.getToDay() !=
          PPF.getToDay(this.options.autoRefreshUserDataLastTime)
        ) {
          this.options.autoRefreshUserDataNextTime =
            new Date().getTime() + 10000;
        } else {
          this.options.autoRefreshUserDataNextTime = this.getNextTime();
        }
      } else {
        this.options.autoRefreshUserDataNextTime = this.getNextTime();
      }
    }

    this.autoRefreshUserDataFailedCount = 0;
    let failedRetryCount =
      this.options.autoRefreshUserDataFailedRetryCount || 3;
    let failedRetryInterval =
      this.options.autoRefreshUserDataFailedRetryInterval || 5;

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

}
