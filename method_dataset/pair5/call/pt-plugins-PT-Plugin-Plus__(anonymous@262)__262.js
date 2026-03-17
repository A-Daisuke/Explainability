function __method_wrapper__() {
    return new Promise((resolve?: any, reject?: any) => {
      clientConfig.client
        .call(EAction.addTorrentFromURL, {
          url: downloadOptions.url,
          savePath: downloadOptions.savePath,
          autoStart:
            downloadOptions.autoStart === undefined
              ? false
              : downloadOptions.autoStart,
          imdbId: downloadOptions.tagIMDb ? downloadOptions.imdbId : null,
          upLoadLimit: siteConfig !== undefined ? siteConfig.upLoadLimit : null,
        })
        .then((result: any) => {
          this.service.logger.add({
            module: EModule.background,
            event: "service.controller.doDownload.finished",
            msg: this.service.i18n.t("service.controller.downloadFinished", {
              name: clientConfig.options.name,
              action: EAction.addTorrentFromURL
            }), // `下载服务器${clientConfig.options.name}处理[${ EAction.addTorrentFromURL}]命令完成`,
            data: result
          });

          // 如果未指定标题，则尝试从种子信息缓存中获取名称
          if (
            !downloadOptions.title &&
            this.torrentInfosCache[downloadOptions.url]
          ) {
            downloadOptions.title = this.torrentInfosCache[downloadOptions.url];
          }

          if (result && (result.code === 0 || result.success === false)) {
            if (
              this.downloadFailedRetry(
                clientConfig,
                downloadOptions,
                host,
                result,
                resolve,
                reject
              )
            ) {
              return;
            }

            switch (result.msg) {
              // 连接超时
              case "timeout":
                reject({
                  success: false,
                  msg: this.service.i18n.t(
                    "service.controller.downloadTimeout"
                  ), //"连接下载服务器超时，请检查网络设置或调整服务器超时时间！",
                  status: "error"
                });
                break;

              default:
                reject({
                  success: false,
                  msg: result.msg,
                  status: "error"
                });
                break;
            }

            this.saveDownloadHistory(
              downloadOptions,
              host,
              clientConfig.options.id,
              false
            );
            return;
          }

          this.saveDownloadHistory(
            downloadOptions,
            host,
            clientConfig.options.id,
            true
          );

          this.formatSendResult(result, clientConfig.options, downloadOptions)
            .then((result: any) => {
              resolve(result);
            })
            .catch((result: any) => {
              reject(result);
            });

          if (this.downloadFailedRetriesCache[downloadOptions.url]) {
            delete this.downloadFailedRetriesCache[downloadOptions.url];
          }
        })
        .catch((result: any) => {
          if (
            this.downloadFailedRetry(
              clientConfig,
              downloadOptions,
              host,
              result,
              resolve,
              reject
            )
          ) {
            return;
          }

          this.service.logger.add({
            module: EModule.background,
            event: "service.controller.doDownload.error",
            msg: this.service.i18n.t("service.controller.downloadError", {
              name: clientConfig.options.name,
              action: EAction.addTorrentFromURL
            }), // `下载服务器${clientConfig.options.name}处理[${EAction.addTorrentFromURL}]命令失败`,
            data: result
          });
          this.saveDownloadHistory(
            downloadOptions,
            host,
            clientConfig.options.id,
            false
          );
          reject(result);
        });
    });

}
