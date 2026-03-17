function __method_wrapper__() {
    return new Promise<any>((resolve?: any, reject?: any) => {
      let saveData = Object.assign(
        {
          time: new Date().getTime(),
          site: null
        },
        newItem
      );

      let movieInfo = Object.assign({}, saveData.movieInfo);

      // 清理站点配置信息
      if (saveData.site) {
        delete saveData.site;
      }

      saveData.link = PPF.getCleaningURL(saveData.link);

      if (movieInfo.imdbId || movieInfo.doubanId) {
        // 获取影片信息
        this.getMoviceInfo(movieInfo.imdbId, movieInfo.doubanId)
          .then(result => {
            saveData.movieInfo = result;
            this.push(saveData);
            resolve(this.items);
          })
          .catch(error => {
            console.log(error);
            this.push(saveData);
            resolve(this.items);
          });
      } else {
        this.push(saveData);
        resolve(this.items);
      }
    });

}
