function __method_wrapper__() {
      searchConfig.entry.forEach((entry: SearchEntry) => {
        let searchPage = entry.entry || siteSearchPage;

        // 当已自动匹配规则时，去除入口页面中已指定的关键字字段
        if (
          autoMatched &&
          searchPage.indexOf(KEY) !== -1 &&
          searchEntryConfigQueryString.indexOf(KEY) !== -1
        ) {
          searchPage = PPF.removeQueryStringFromValue(searchPage, KEY);
        }

        let queryString = entry.queryString;

        if (searchEntryConfigQueryString) {
          // 当前入口没有查询字符串时，尝试使用默认配置
          if (!queryString) {
            queryString = searchEntryConfigQueryString;

            // 当前入口有查询字符串，并且不包含搜索关键字时，使用追加方式
          } else if (queryString && queryString.indexOf(KEY) === -1) {
            queryString = searchEntryConfigQueryString + "&" + queryString;
          }
        }

        if (entry.appendQueryString) {
          queryString += entry.appendQueryString;
        }
        if (searchEntryConfig) {
          entry.parseScriptFile =
            searchEntryConfig.parseScriptFile || entry.parseScriptFile;
          entry.resultType = searchEntryConfig.resultType || entry.resultType;
          entry.requestDataType = searchEntryConfig.requestDataType || entry.requestDataType;
          entry.resultSelector =
            searchEntryConfig.resultSelector || entry.resultSelector;
          entry.headers = searchEntryConfig.headers || entry.headers;
          entry.asyncParse = searchEntryConfig.asyncParse || entry.asyncParse;
          entry.requestData = searchEntryConfig.requestData;
        }

        // 判断是否指定了搜索页和用于获取搜索结果的脚本
        if (searchPage && entry.parseScriptFile && entry.enabled !== false) {
          let rows: number =
            this.options.search && this.options.search.rows
              ? this.options.search.rows
              : 10;

          // 如果有自定义地址，则使用自定义地址
          if (site.cdn && site.cdn.length > 0) {
            site.url = site.cdn[0];
          }

          // 组织搜索入口
          if ((site.url + "").substr(-1) != "/") {
            site.url += "/";
          }
          if ((searchPage + "").substr(0, 1) == "/") {
            searchPage = (searchPage + "").substr(1);
          }
          let url: string = site.url + searchPage;

          if (queryString) {
            if (searchPage.indexOf("?") !== -1) {
              url += "&" + queryString;
            } else {
              url += "?" + queryString;
            }
          }

          // 支除重复的参数
          url = PPF.removeDuplicateQueryString(url);

          let searchKey =
            key +
            (entry.appendToSearchKeyString
              ? ` ${entry.appendToSearchKeyString}`
              : "");
          url = this.replaceKeys(url, {
            key: searchKey,
            rows: rows,
            passkey: site.passkey ? site.passkey : ""
          });

          // 替换要提交数据中包含的关键字内容
          if (entry.requestData) {
            try {
              for (const key in entry.requestData) {
                if (entry.requestData.hasOwnProperty(key)) {
                  const value = entry.requestData[key];
                  if (typeof value !== 'string') continue
                  entry.requestData[key] = PPF.replaceKeys(value, {
                    key: searchKey,
                    passkey: site.passkey ? site.passkey : ""
                  });

                  if (site.user) {
                    entry.requestData[key] = PPF.replaceKeys(
                      entry.requestData[key],
                      site.user,
                      "user"
                    );
                  }
                }
              }
            } catch (error) {
              this.service.writeErrorLog(error);
              this.service.debug(error);
            }
          }
          // 替换要提交请求头中的内容
          if (entry.headers) {
            for (const key in entry.headers) {
              if (entry.headers.hasOwnProperty(key)) {
                const value = entry.headers[key];
                entry.headers[key] = PPF.replaceKeys(value, {
                  key: searchKey,
                  passkey: site.passkey ? site.passkey : ""
                });

                if (site.user) {
                  entry.headers[key] = PPF.replaceKeys(
                    entry.headers[key],
                    site.user,
                    "user"
                  );
                }
              }
            }
          }
          // 替换用户相关信息
          if (site.user) {
            url = this.replaceKeys(url, site.user, "user");
          }

          entryCount++;

          let scriptPath = entry.parseScriptFile;
          // 判断是否为相对路径
          if (scriptPath.substr(0, 1) !== "/") {
            scriptPath = `${searchConfig.rootPath}${scriptPath}`;
          }

          entry.parseScript = this.parseScriptCache[scriptPath];

          if (!entry.parseScript) {
            this.service.debug("searchTorrent: getScriptContent", scriptPath);
            APP.getScriptContent(scriptPath)
              .done((script: string) => {
                this.service.debug(
                  "searchTorrent: getScriptContent done",
                  scriptPath
                );
                this.parseScriptCache[scriptPath] = script;
                entry.parseScript = script;
                this.getSearchResult(
                  url,
                  site,
                  Object.assign(PPF.clone(searchEntryConfig), PPF.clone(entry)),
                  searchConfig.torrentTagSelectors
                )
                  .then((result: any) => {
                    this.service.debug(
                      "searchTorrent: getSearchResult done",
                      url
                    );
                    if (result && result.length) {
                      results.push(...result);
                    }
                    doneCount++;

                    if (doneCount === entryCount || results.length >= rows) {
                      resolve(results.slice(0, rows));
                    }
                  })
                  .catch((result: any) => {
                    this.service.debug(
                      "searchTorrent: getSearchResult catch",
                      url,
                      result
                    );
                    doneCount++;

                    if (doneCount === entryCount) {
                      if (results.length > 0) {
                        resolve(results.slice(0, rows));
                      } else {
                        reject(result);
                      }
                    }
                  });
              })
              .fail(error => {
                this.service.debug(
                  "searchTorrent: getScriptContent fail",
                  error
                );
              });
          } else {
            this.getSearchResult(
              url,
              site,
              Object.assign(PPF.clone(searchEntryConfig), PPF.clone(entry)),
              searchConfig.torrentTagSelectors
            )
              .then((result: any) => {
                if (result && result.length) {
                  results.push(...result);
                }
                doneCount++;

                if (doneCount === entryCount || results.length >= rows) {
                  resolve(results.slice(0, rows));
                }
              })
              .catch((result: any) => {
                doneCount++;

                if (doneCount === entryCount) {
                  if (results.length > 0) {
                    resolve(results.slice(0, rows));
                  } else {
                    reject(result);
                  }
                }
              });
          }
        }
      });

}
