function __method_wrapper__() {
        groups.forEach(group => {
          if (group.hasOwnProperty("torrents")) {
            let torrents = group.torrents;
            torrents.forEach(torrent => {
              let data = {
                id: torrent.torrentId,
                title:
                  group.groupName +
                  " - " +
                  group.groupSubName +
                  " [" +
                  group.groupYear +
                  "] [" +
                  group.releaseType +
                  "]",
                subTitle:
                  torrent.codec +
                  " / " +
                  torrent.source +
                  " / " +
                  torrent.resolution +
                  " / " +
                  torrent.container +
                  " / " +
                  torrent.processing +
                  (torrent.remasterTitle ? ` / ${torrent.remasterTitle}` : "") +
                  (torrent.scene ? " / Scene" : "") +
                  (torrent.isFreeleech ||
                  torrent.isNeutralLeech ||
                  torrent.isPersonalFreeleech
                    ? " / Freeleech"
                    : "") +
                  (torrent.releaseGroup ? ` / ${torrent.releaseGroup}` : ""),
                link: `${site.url}torrents.php?id=${group.groupId}&torrentid=${torrent.torrentId}`,
                url: `${site.url}torrents.php?action=download&id=${torrent.torrentId}&authkey=${authkey}&torrent_pass=${passkey}`,
                size: parseFloat(torrent.size),
                time: torrent.time,
                seeders: torrent.seeders,
                leechers: torrent.leechers,
                completed: torrent.snatches,
                site: site,
                entryName: options.entry.name,
                category: group.releaseType,
                imdbId: group.imdbId,
              };
              results.push(data);
            });
          } else {
            let data = {
              title: group.groupName,
              link: `${site.url}torrents.php?id=${group.groupId}&torrentid=${group.torrentId}`,
              url: `${site.url}torrents.php?action=download&id=${group.torrentId}&authkey=${authkey}&torrent_pass=${passkey}`,
              size: parseFloat(group.size),
              time: group.groupTime,
              author: "",
              seeders: group.seeders,
              leechers: group.leechers,
              completed: group.snatches,
              comments: 0,
              site: site,
              tags: group.tags,
              entryName: options.entry.name,
              category: group.category,
              imdbId: group.imdbId,
            };
            results.push(data);
          }
        });

}
