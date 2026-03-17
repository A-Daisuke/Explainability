function __method_wrapper__() {
    downloadURLsInBackground(urls, callback, downloadOptions) {
      const items = [];

      const savePath = downloadOptions
        ? PTService.pathHandler.getSavePath(
            downloadOptions.savePath || downloadOptions.path,
            PTService.site
          )
        : "";

      urls.forEach(url => {
        if (downloadOptions) {
          items.push({
            clientId: downloadOptions.client.id,
            url,
            savePath,
            autoStart: downloadOptions.client.autoStart,
            tagIMDb: downloadOptions.client.tagIMDb
          });
        } else {
          items.push({
            url
          });
        }
      });

      PTService.call(PTService.action.sendTorrentsInBackground, items)
        .then(result => {
          callback(result);
        })
        .catch(result => {
          callback(result);
        });
    }

}
