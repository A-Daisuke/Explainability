class __C__ {
  constructor(
    public options: IPageSelector,
    public site: Site,
    public timeout: number = 30000,
    public commonDatas?: Dictionary<any>
  ) {
    let url: string = site.url + "";

    // 如果有自定义地址，则使用自定义地址
    if (site.cdn && site.cdn.length > 0) {
      url = site.cdn[0];
    }

    if ((url + "").substr(-1) != "/") {
      url += "/";
    }

    let page = this.options.page;
    if ((page + "").substr(0, 1) == "/") {
      page = (page + "").substr(1);
    }

    this.url = (url + page)
      .replace("://", "****")
      .replace(/\/\//g, "/")
      .replace("****", "://");

    this.requestData = this.options.requestData;
    if (this.requestData && this.commonDatas) {
      try {
        for (const key in this.requestData) {
          if (this.requestData.hasOwnProperty(key)) {
            const value = this.requestData[key];
            for (const commonKey in this.commonDatas) {
              if (this.commonDatas.hasOwnProperty(commonKey)) {
                this.requestData[key] = PPF.replaceKeys(
                  value,
                  this.commonDatas[commonKey],
                  commonKey
                );
              }
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    this.cacheKey = md5(this.url + JSON.stringify(this.requestData || {}));
  }

}
