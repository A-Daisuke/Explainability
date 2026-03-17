function __method_wrapper__() {
    return new Promise<any>((resolve?: any, reject?: any) => {
      try {
        const zip = new JSZip();

        if (rawData.options.system) {
          delete rawData.options.system;
        }

        const _options = rawData.options as Options;
        const secretKey = _options.encryptBackupData
          ? _options.encryptSecretKey
          : "";
        if (_options.encryptSecretKey) {
          delete rawData.options.encryptSecretKey;
        }
        const options = this.encryptData(rawData.options, secretKey);
        const userData = this.encryptData(rawData.userData, secretKey);

        // 配置
        zip.file("options.json", options);
        // 用户数据
        zip.file("userdatas.json", userData);

        // 创建检证用的文件
        const manifest = {
          checkInfo: this.createHash(options + userData),
          version: PPF.getVersion(),
          time: new Date().getTime(),
          encryptMode: secretKey ? EEncryptMode.AES : ""
        };
        zip.file("manifest.json", JSON.stringify(manifest));

        // 用户收藏
        if (rawData.collection) {
          zip.file(
            "collection.json",
            this.encryptData(rawData.collection, secretKey)
          );
        }

        // 站点Cookies
        if (rawData.cookies) {
          zip.file(
            "cookies.json",
            this.encryptData(rawData.cookies, secretKey)
          );
        }

        // 搜索结果快照
        if (rawData.searchResultSnapshot) {
          zip.file(
            "searchResultSnapshot.json",
            this.encryptData(rawData.searchResultSnapshot, secretKey)
          );
        }

        // 辅种任务
        if (rawData.keepUploadTask) {
          zip.file(
            "keepUploadTask.json",
            this.encryptData(rawData.keepUploadTask, secretKey)
          );
        }

        // 下载历史
        if (rawData.downloadHistory) {
          zip.file(
            "downloadHistory.json",
            this.encryptData(rawData.downloadHistory, secretKey)
          );
        }

        // 压缩处理
        zip
          .generateAsync({
            type: "blob",
            compression: "DEFLATE",
            // level 范围： 1-9 ，9为最高压缩比
            compressionOptions: {
              level: 9
            }
          })
          .then((blob: any) => {
            resolve(blob);
          });
      } catch (error) {
        reject(error);
      }
    });

}
