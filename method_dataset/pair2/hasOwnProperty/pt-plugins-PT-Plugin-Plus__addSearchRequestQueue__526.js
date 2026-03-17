function __method_wrapper__() {
  public addSearchRequestQueue(
    url: string,
    site: Site,
    entry: SearchEntry,
    torrentTagSelectors?: any[],
    beforeSearchData?: any
  ): Promise<any> {
    let _entry = PPF.clone(entry);
    if (_entry.parseScript) {
      delete _entry.parseScript;
    }

    // 是否包含搜索前处理的数据
    if (beforeSearchData) {
      this.service.debug("beforeSearchData", beforeSearchData);
      url = this.replaceKeys(url, beforeSearchData, "beforeSearchData");

      // 替换要提交数据中包含的关键字内容
      if (entry.requestData) {
        try {
          for (const key in entry.requestData) {
            if (entry.requestData.hasOwnProperty(key)) {
              const value = entry.requestData[key];
              entry.requestData[key] = PPF.replaceKeys(
                value,
                beforeSearchData,
                "beforeSearchData"
              );
            }
          }
        } catch (error) {
          this.service.writeErrorLog(error);
          this.service.debug(error);
        }
      }
    }

    this.service.debug("getSearchResult.start", {
      url,
      site: site.host,
      entry: _entry
    });
    let logId = "";
    let contentType = 'text/plain';
    let data: Dictionary<any> | string | undefined = entry.requestData
    switch (entry.requestDataType) {
      case ERequestType.JSON:
        contentType = 'application/json';
        if (data)
          data = JSON.stringify(data);
      case ERequestType.TEXT:
      default:
    }
    return new Promise<any>((resolve?: any, reject?: any) => {
      this.searchRequestQueue[url] = $.ajax({
        url: url,
        cache: true,
        dataType: "text",
        contentType,
        timeout: this.options.connectClientTimeout || 30000,
        headers: entry.headers,
        method: entry.requestMethod || ERequestMethod.GET,
        data
      })
        .done((result: any) => {
          this.service.debug("getSearchResult.done", url);
          delete this.searchRequestQueue[url];
          if (
            (result && typeof result == "string" && result.length > 100) ||
            typeof result == "object"
          ) {
            let page: any;
            let doc: any;
            try {
              switch (entry.resultType) {
                case ERequestResultType.JSON:
                  page = JSON.parse(result);
                  break;

                default:
                  doc = new DOMParser().parseFromString(result, "text/html");
                  // 构造 jQuery 对象
                  page = $(doc).find("body");
                  break;
              }
            } catch (error) {
              logId = this.service.logger.add({
                module: EModule.background,
                event:
                  "service.searcher.getSearchResult.siteSearchResultParseFailed",
                msg: error
              });

              // 数据解析失败
              reject({
                success: false,
                msg: this.service.i18n.t(
                  "service.searcher.siteSearchResultParseFailed",
                  {
                    site
                  }
                ),
                data: {
                  logId
                },
                type: EDataResultType.error
              });
              return;
            }

            let options: any = {
              results: [],
              responseText: result,
              site,
              resultSelector: entry.resultSelector,
              page,
              entry,
              torrentTagSelectors: torrentTagSelectors,
              errorMsg: "",
              isLogged: false,
              status: ESearchResultParseStatus.success,
              searcher: this,
              url
            };

            // 执行获取结果的脚本
            try {
              if (entry.parseScript) {
                // 异步脚本，由脚本负责调用 reject 和 resolve
                if (entry.asyncParse) {
                  options = Object.assign(
                    {
                      reject,
                      resolve
                    },
                    options
                  );
                  eval(entry.parseScript);
                  return;
                } else {
                  eval(entry.parseScript);
                }
              }
              if (
                options.errorMsg ||
                options.status != ESearchResultParseStatus.success
              ) {
                reject({
                  success: false,
                  msg: this.getErrorMessage(
                    site,
                    options.status,
                    options.errorMsg
                  ),
                  data: {
                    site,
                    isLogged: options.isLogged
                  }
                });
              } else {
                resolve(PPF.clone(options.results));
              }
            } catch (error) {
              console.error(error);
              logId = this.service.logger.add({
                module: EModule.background,
                event: "service.searcher.getSearchResult.siteEvalScriptFailed",
                msg: error
              });
              // 脚本执行出错
              reject({
                success: false,
                msg: this.service.i18n.t(
                  "service.searcher.siteEvalScriptFailed",
                  {
                    site
                  }
                ),
                data: {
                  logId
                }
              });
            }
          } else {
            logId = this.service.logger.add({
              module: EModule.background,
              event: "service.searcher.getSearchResult.siteSearchResultError",
              msg: result
            });
            // 没有返回预期的数据
            reject({
              success: false,
              msg: this.service.i18n.t(
                "service.searcher.siteSearchResultError",
                {
                  site
                }
              ),
              data: {
                logId
              },
              type: EDataResultType.error
            });
          }
        })
        .fail((jqXHR, textStatus, errorThrown) => {
          delete this.searchRequestQueue[url];

          this.service.debug({
            title: "getSearchResult.fail",
            url,
            entry,
            textStatus,
            errorThrown
          });
          logId = this.service.logger.add({
            module: EModule.background,
            event: "service.searcher.getSearchResult.fail",
            msg: errorThrown,
            data: {
              url,
              entry,
              code: jqXHR.status,
              textStatus,
              errorThrown,
              responseText: jqXHR.responseText
            }
          });

          // 网络请求失败
          reject({
            data: {
              logId,
              textStatus
            },
            msg: this.service.i18n.t("service.searcher.siteNetworkFailed", {
              site,
              msg: `${jqXHR.status} ${errorThrown}, ${textStatus}`
            }),
            success: false,
            type: EDataResultType.error
          });
        });
    });
  }

}
