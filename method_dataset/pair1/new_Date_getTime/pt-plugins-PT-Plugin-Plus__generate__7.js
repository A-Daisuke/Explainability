function __method_wrapper__() {
  public generate() {
    let results: any[] = [];
    let count = Math.floor(Math.random() * 100);
    const status = [1, 2, 255, undefined];
    for (let i = 0; i < count; i++) {
      let host = this.getHost();
      let data = {
        title: this.getTitle(),
        subTitle: this.getSubTitle(),
        link: `https://${host}/details.php?id=${i}`,
        url: `https://${host}/download.php?id=${i}`,
        size: this.getSize(),
        time: Math.floor(
          new Date().getTime() / 1000 - Math.floor(Math.random() * 10000000)
        ),
        author: "匿名",
        seeders: Math.floor(Math.random() * 1000),
        leechers: Math.floor(Math.random() * 1000),
        completed: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 1000),
        host: host,
        tags: this.getTags(),
        entryName: "全部",
        progress: Math.floor(Math.random() * 100),
        status: status[Math.floor(Math.random() * status.length)]
      };

      results.push(data);
    }

    return JSON.stringify(results);
  }

}
