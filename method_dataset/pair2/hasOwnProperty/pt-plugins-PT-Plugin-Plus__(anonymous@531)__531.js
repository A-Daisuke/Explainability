function __method_wrapper__() {
            this.options.clients.forEach((client: DownloadClient) => {
              let paths = client.paths;
              if (paths) {
                for (const key in paths) {
                  if (key == host && paths.hasOwnProperty(key)) {
                    console.log(
                      "upgradeSites.client.paths",
                      client.name,
                      key,
                      newHost
                    );
                    const element = paths[key];
                    paths[newHost] = Object.assign([], element);
                    delete paths[key];
                  }
                }
              }
            });

}
