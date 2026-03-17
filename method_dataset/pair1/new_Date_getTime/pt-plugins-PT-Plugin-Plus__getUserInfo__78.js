function __method_wrapper__() {
  public getUserInfo(site: Site, returnResolve: boolean = false): Promise<any> {
    this.service.options.autoRefreshUserDataLastTime = new Date().getTime();
    this.service.saveConfig();
    return new Promise<any>((resolve?: any, reject?: any) => {
      let rejectFN = returnResolve ? resolve : reject;
      if (!site) {
        rejectFN(null);
        return;
      }

      // 获取最近一次数据
      let userInfo: UserInfo =
        this.service.userData.get(site.host as string) || {};

      let rule = this.service.getSiteSelector(site, "userBaseInfo");
      if (!rule) {
        userInfo.lastUpdateStatus = EUserDataRequestStatus.notSupported;
        this.updateStatus(site, userInfo);
        rejectFN(
          APP.createErrorMessage({
            status: EUserDataRequestStatus.notSupported,
            msg: this.service.i18n.t("service.user.notSupported") // "暂不支持"
          })
        );

        return;
      }

      let url: string = `${this.getSiteURL(site)}${rule.page}`;
      let host = site.host as string;
      // 上次请求未完成时，直接返回最近的数据
      if (this.checkQueue(host, url)) {
        resolve(userInfo);
        return;
      }

      // 获取用户基本信息（用户名、ID、是否登录等）
      this.getInfos(host, url, rule)
        .then((result: any) => {
          console.log("userBaseInfo", host, result);
          userInfo = Object.assign({}, result);
          // 是否已定义已登录选择器
          if (rule && rule.fields && rule.fields.isLogged) {
            // 如果已定义则以选择器匹配为准
            if (userInfo.isLogged && (userInfo.name || userInfo.id)) {
              userInfo.isLogged = true;
            } else {
              userInfo.isLogged = false;
            }
          } else if (userInfo.name || userInfo.id) {
            userInfo.isLogged = true;
          }

          if (!userInfo.isLogged) {
            userInfo.lastUpdateStatus = EUserDataRequestStatus.needLogin;
            //this.updateStatus(site, userInfo);

            rejectFN(
              APP.createErrorMessage({
                msg: this.service.i18n.t("service.user.notLogged"), //"未登录",
                status: EUserDataRequestStatus.needLogin
              })
            );
            return;
          }

          rule = this.service.getSiteSelector(site, "userExtendInfo");

          if (!rule) {
            this.updateStatus(site, userInfo);
            resolve(userInfo);
            return;
          }

          if (userInfo.name || userInfo.id) {
            let url = `${this.getSiteURL(site)}${rule.page
              .replace("$user.id$", userInfo.id)
              .replace("$user.name$", userInfo.name)
              .replace("$user.bonusPage$", userInfo.bonusPage)
              .replace("$user.unsatisfiedsPage$", userInfo.unsatisfiedsPage)}`;
            // 上次请求未完成时，直接返回最近的数据
            if (this.checkQueue(host, url)) {
              resolve(userInfo);
              return;
            }

            this.getInfos(host, url, rule, site, userInfo)
              .then((result: any) => {
                userInfo = Object.assign(userInfo, result);

                userInfo.lastUpdateStatus = EUserDataRequestStatus.success;
                this.updateStatus(site, userInfo);
                this.getMoreInfos(site, userInfo).then(() => {
                  resolve(userInfo);
                });
              })
              .catch((error: any) => {
                userInfo.lastUpdateStatus = EUserDataRequestStatus.unknown;
                //this.updateStatus(site, userInfo);
                rejectFN(APP.createErrorMessage(error));
              });
          } else {
            userInfo.lastUpdateStatus = EUserDataRequestStatus.unknown;
            //this.updateStatus(site, userInfo);
            rejectFN(
              APP.createErrorMessage({
                status: EUserDataRequestStatus.unknown,
                msg: this.service.i18n.t("service.user.getUserInfoFailed") //"获取用户名和编号失败"
              })
            );
          }
        })
        .catch((error: any) => {
          userInfo.lastUpdateStatus = EUserDataRequestStatus.unknown;
          console.log("getInfos Error :",error);
          //this.updateStatus(site, userInfo);
          rejectFN(APP.createErrorMessage(error));
        });
    });
  }

}
