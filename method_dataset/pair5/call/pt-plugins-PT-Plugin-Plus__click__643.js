function __method_wrapper__() {
        click: (success, error) => {
          let title = "";

          if (this.getTitle) {
            title = this.getTitle();
          } else {
            title = PTService.getFieldValue("title");
          }

          if (!title) {
            title = $("title:first").text();
          }

          let imdbId = PTService.getFieldValue("imdbId");

          if (!imdbId) {
            const link = $("a[href*='www.imdb.com/title/']:first");
            if (link.length > 0) {
              let match = link.attr("href").match(/(tt\d+)/);

              if (match && match.length >= 2) {
                imdbId = match[1];
              }
            }
          }

          let doubanId = PTService.getFieldValue("doubanId");

          if (!doubanId) {
            const link = $("a[href*='movie.douban.com/subject/']:first");
            if (link.length > 0) {
              let match = link.attr("href").match(/subject\/(\d+)/);

              if (match && match.length >= 2) {
                doubanId = match[1];
              }
            }
          }

          const data = {
            title: title,
            url: this.getDownloadURL(),
            link: location.href,
            host: location.host,
            size: PTService.getFieldValue("size"),
            subTitle: PTService.getFieldValue("subTitle"),
            movieInfo: {
              imdbId: imdbId,
              doubanId: doubanId
            }
          };

          PTService.call(PTService.action.addTorrentToCollection, data)
            .then(result => {
              success();
              setTimeout(() => {
                this.addRemoveCollectionButton(data);
              }, 1000);
            })
            .catch(() => {
              error();
            });
        }

}
