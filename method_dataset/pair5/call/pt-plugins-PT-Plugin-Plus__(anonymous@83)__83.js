function __method_wrapper__() {
    return new Promise<any>((resolve?: any, reject?: any) => {
      let result: any;
      // if (
      //   ![
      //     EAction.getSystemLogs,
      //     EAction.writeLog,
      //     EAction.readConfig,
      //     EAction.saveConfig,
      //     EAction.saveUIOptions,
      //     EAction.openOptions,
      //     EAction.getClearedOptions,
      //     EAction.getBase64FromImageUrl,
      //     EAction.changeLanguage,
      //     EAction.addLanguage,
      //     EAction.getCurrentLanguageResource,
      //     EAction.replaceLanguage,
      //     EAction.readUIOptions,
      //     EAction.addContentPage,
      //     EAction.getDownloadHistory,
      //     EAction.getTorrentDataFromURL
      //   ].includes(request.action)
      // ) {
      //   this.logger.add({
      //     module: EModule.background,
      //     event: `${ELogEvent.requestMessage}.${request.action}`
      //   });
      // }

      try {
        switch (request.action) {
          // 读取参数
          case EAction.readConfig:
            if (this.localMode) {
              this.readConfig().then(() => {
                resolve(this.options);
              });
            } else {
              resolve(this.options);
            }

            break;

          // 保存参数
          case EAction.saveConfig:
            if (
              request.data.locale &&
              request.data.locale != this.options.locale
            ) {
              this.i18n.reset(request.data.locale);
            }
            this.config.save(request.data);
            this.options = request.data;
            if (this.controller.isInitialized) {
              this.controller.reset(this.options);
            }
            setTimeout(() => {
              this.contentMenus.init(this.options);
            }, 100);
            this.resetAutoRefreshUserDataTimer();
            resolve(this.options);
            break;

          // 获取已清理的配置
          case EAction.getClearedOptions:
            resolve(this.config.cleaningOptions(this.options));
            break;

          // 重置运行时配置
          case EAction.resetRunTimeOptions:
            this.config.resetRunTimeOptions(request.data);
            this.options = this.config.options;
            resolve(this.options);
            break;

          // 复制指定的内容到剪切板
          case EAction.copyTextToClipboard:
            result = this.controller.copyTextToClipboard(request.data);
            if (result) {
              resolve(result);
            } else {
              reject();
            }
            break;

          // 打开选项卡
          case EAction.openOptions:
            this.controller.openOptions(request.data);
            resolve(true);
            break;

          case EAction.updateOptionsTabId:
            this.controller.updateOptionsTabId(request.data);
            resolve(true);
            break;

          // 搜索种子
          case EAction.searchTorrent:
            console.log(request.data);
            this.controller.searchTorrent(request.data);
            resolve(true);
            break;

          // 测试客户是否可连接
          case EAction.testClientConnectivity:
            this.controller.clientController
              .testClientConnectivity(request.data)
              .then((result: any) => {
                resolve(result);
              })
              .catch((result: any) => {
                this.logger.add({
                  module: EModule.background,
                  event: `${EAction.testClientConnectivity}`,
                  msg: this.i18n.t("service.testClientConnectivityFailed", {
                    address: request.data.address
                  }), // `测试客户连接失败[${request.data.address}]`,
                  data: result
                });
                reject(result);
              });
            break;

          case EAction.getSystemLogs:
            this.logger
              .load()
              .then((result: any) => {
                resolve(result);
              })
              .catch((result: any) => {
                reject(result);
              });
            break;

          case EAction.removeSystemLogs:
            this.logger
              .remove(request.data)
              .then((result: any) => {
                resolve(result);
              })
              .catch((result: any) => {
                reject(result);
              });
            break;

          case EAction.clearSystemLogs:
            this.logger
              .clear()
              .then((result: any) => {
                resolve(result);
              })
              .catch((result: any) => {
                reject(result);
              });
            break;

          case EAction.writeLog:
            this.logger.add(request.data);
            resolve(true);
            break;

          case EAction.readUIOptions:
            this.config
              .readUIOptions()
              .then((result: any) => {
                resolve(result);
              })
              .catch((result: any) => {
                reject(result);
              });
            break;

          case EAction.saveUIOptions:
            this.config
              .saveUIOptions(request.data)
              .then((result: any) => {
                resolve(result);
              })
              .catch((result: any) => {
                reject(result);
              });
            break;

          case EAction.changeLanguage:
            return this.i18n.reset(request.data);
            break;

          // 如果没有特殊的情况默认使用处理器来处理
          default:
            if ((this as any)[request.action]) {
              (this as any)
                [request.action](request.data, sender)
                .then((result: any) => {
                  resolve(result);
                })
                .catch((result: any) => {
                  reject(result);
                });
              return;
            }
            this.controller
              .call(request, sender)
              .then((result: any) => {
                resolve(result);
              })
              .catch((result: any) => {
                reject(result);
              });
            break;
        }
      } catch (error) {
        reject(error);
      }
    });

}
