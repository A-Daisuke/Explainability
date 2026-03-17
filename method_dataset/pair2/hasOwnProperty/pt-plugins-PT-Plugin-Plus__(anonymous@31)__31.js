function __method_wrapper__() {
        torrentList.forEach(item => {
          if (item.hasOwnProperty("fid")) {
            let data = {
              title: item.name,
              link: `${site.url}torrent/${item.fid}`,
              url: `${site.url}download/${item.fid}/${item.filename}`,
              size: parseFloat(item.size),
              time: item.addedTimestamp,
              author: "",
              seeders: item.seeders,
              leechers: item.leechers,
              completed: item.completed,
              comments: item.numComments,
              site: site,
              tags: this.getTags(item),
              entryName: options.entry.name,
              category: options.searcher.getCategoryById(
                site,
                options.url,
                item.categoryID
              ),
              imdbId: item.imdbID
            };
            results.push(data);
          }
        });

}
