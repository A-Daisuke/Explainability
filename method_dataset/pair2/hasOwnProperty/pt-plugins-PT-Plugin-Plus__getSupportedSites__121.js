function __method_wrapper__() {
  public getSupportedSites() {
    let schemaFolder = PATH.join(this.resourcePath, "schemas");
    let schemaList = FS.readdirSync(schemaFolder);

    let schemas: any = {};
    schemaList.forEach((path: string) => {
      let file = PATH.join(schemaFolder, path);
      var stat = FS.statSync(file);
      // 仅获取目录
      if (stat && stat.isDirectory()) {
        schemas[path] = [];
      }
    });

    schemas["其他架构"] = [];

    let parentFolder = PATH.join(this.resourcePath, "sites");

    let list = FS.readdirSync(parentFolder);

    let itemTemplate =
      "| $schema$ | $name$ | $search$ | $imdbSearch$ | $userData$ | $sendTorrent$ | $torrentProgress$ | $collaborator$ |";

    list.forEach((path: string) => {
      let file = PATH.join(parentFolder, path);
      var stat = FS.statSync(file);
      // 仅获取目录
      if (stat && stat.isDirectory()) {
        let fileName = PATH.join(file, `config.json`);
        let content = JSON.parse(FS.readFileSync(fileName, "utf-8"));
        let schema = content.schema;
        if (!schemas[schema]) {
          schema = "其他架构";
        }

        let supportedFeatures = {
          search: true,
          imdbSearch: true,
          userData: true,
          sendTorrent: true
        };

        if (content.supportedFeatures) {
          supportedFeatures = Object.assign(
            supportedFeatures,
            content.supportedFeatures
          );
        }

        // 判断是否有跳过 IMDb 选项，有则定为不支持 IMDb
        if (content.searchEntryConfig) {
          if (content.searchEntryConfig.skipIMDbId === true) {
            supportedFeatures.imdbSearch = false;
          }
        }

        let count = schemas[schema].length;
        let item = this.replaceKeys(itemTemplate, {
          schema: count == 0 ? schema : "",
          name: content.name,
          search: supportedFeatures.search === true ? "√" : "",
          imdbSearch: supportedFeatures.imdbSearch === true ? "√" : "",
          userData:
            supportedFeatures.userData === true
              ? "√"
              : supportedFeatures.userData === false
              ? ""
              : supportedFeatures.userData,
          sendTorrent: supportedFeatures.sendTorrent === true ? "√" : "",
          torrentProgress:
            content.searchEntryConfig &&
            content.searchEntryConfig.fieldSelector &&
            content.searchEntryConfig.fieldSelector.progress
              ? "√"
              : "",
          collaborator: this.getCollaborator(content.collaborator)
        });
        schemas[schema].push(item);
      }
    });

    console.log("\n");
    for (const key in schemas) {
      if (schemas.hasOwnProperty(key)) {
        const items: Array<any> = schemas[key];
        // console.log(`\n## ${key}`);

        items.forEach((item: string) => {
          console.log(item);
        });
      }
    }
    console.log("\n");

    // console.log(results);
  }

}
