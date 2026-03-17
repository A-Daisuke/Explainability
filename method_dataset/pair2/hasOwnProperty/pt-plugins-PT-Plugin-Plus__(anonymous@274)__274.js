function __method_wrapper__() {
    return new Promise<any>((resolve?: any, reject?: any) => {
      url = url
        .replace("://", "****")
        .replace(/\/\//g, "/")
        .replace("****", "://");

      let requestData = rule.requestData;
      if (requestData && userInfo) {
        try {
          for (const key in requestData) {
            if (requestData.hasOwnProperty(key)) {
              const value = requestData[key];
              requestData[key] = PPF.replaceKeys(value, userInfo, "user");
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      let headers = rule.headers;
      if (headers && userInfo) {
        try {
          for (const key in headers) {
            if (headers.hasOwnProperty(key)) {
              const value = headers[key];
              headers[key] = PPF.replaceKeys(value, userInfo, "user");
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      /**
       * 是否有脚本解析器
       */
      if (rule.parser && site) {
        this.runParser(rule, site, userInfo, resolve, reject);
        return;
      }

      PPF.updateBadge(++this.requestQueueCount);

      let request = $.ajax({
        url,
        method: rule.requestMethod || ERequestMethod.GET,
        dataType: "text",
        data: requestData,
        headers: rule.headers,
        timeout: this.service.options.connectClientTimeout || 30000
      })
        .done(result => {
          this.removeQueue(host, url);
          PPF.updateBadge(--this.requestQueueCount);
          let content: any;
          try {
            if (rule.dataType !== ERequestResultType.JSON) {
              let doc = new DOMParser().parseFromString(result, "text/html");
              // 构造 jQuery 对象
              let topElement = rule.topElement || "body";
              content = $(doc).find(topElement);
            } else {
              content = JSON.parse(result);
            }
          } catch (error) {
            this.service.debug("getInfos.error", host, url, error);
            reject(error);
            return;
          }

          if (content && rule) {
            try {
              let results = new InfoParser().getResult(content, rule);
              resolve(results);
            } catch (error) {
              this.service.debug(error);
              reject(error);
            }
          }
        })
        .fail((jqXHR, textStatus, errorThrown) => {
          this.removeQueue(host, url);
          PPF.updateBadge(--this.requestQueueCount);
          let msg = this.service.i18n.t("service.searcher.siteNetworkFailed", {
            site,
            msg: `${jqXHR.status} ${errorThrown}, ${textStatus}`
          });
          this.service.debug(msg, host, url, jqXHR.responseText);
          reject(msg);
        });

      this.addQueue(host, url, request);
    });

}
