function __method_wrapper__() {
    return new Promise<any>((resolve?: any, reject?: any) => {
      let movieId = imdbId;
      let fn = this.movieInfoService.getInfoFromIMDb;
      if (doubanId) {
        movieId = doubanId;
        fn = this.movieInfoService.getInfoFromDoubanId;
      }

      // 获取影片信息
      fn.call(this.movieInfoService, movieId)
        .then(result => {
          // 保留数字ID
          let movieInfo = {
            imdbId,
            doubanId: result.id.toString().replace(/(\D)/g, ""),
            image:
              result.image || (result.images ? result.images.small : undefined),
            title: result.title,
            link: result.mobile_link || result.share_url,
            alt_title: result.alt_title || result.original_title,
            year: result.year
          };
          if (!result.year && result.attrs) {
            movieInfo.year = result.attrs.year[0];
          }

          resolve(movieInfo);
        })
        .catch(error => {
          reject();
        });
    });

}
