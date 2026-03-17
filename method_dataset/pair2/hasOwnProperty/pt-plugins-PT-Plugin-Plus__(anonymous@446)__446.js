function __method_wrapper__() {
    return new Promise<any>((resolve?: any, reject?: any) => {
      let host = site.host as string;
      let queues = this.requestQueue[host];
      let errors: any[] = [];

      if (queues) {
        for (const key in queues) {
          if (queues.hasOwnProperty(key)) {
            const request = queues[key];
            try {
              request.abort();
            } catch (error) {
              this.service.logger.add({
                module: EModule.background,
                event: "user.abortGetUserInfo.error",
                msg: this.service.i18n.t("service.user.abortGetUserInfoFailed"), //"取消获取用户信息请求失败",
                data: {
                  site: site.host,
                  error
                }
              });
              errors.push(error);
            }
          }
        }
        delete this.requestQueue[host];
      }

      if (errors.length > 0) {
        reject(errors);
      } else {
        resolve(true);
      }
    });

}
