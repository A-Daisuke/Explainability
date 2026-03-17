function __method_wrapper__() {
    getTime(cell) {
      let time = cell.find("span[title],time[title]").attr("title");
      if (!time) {
        time = $("<span>")
          .html(cell.html().replace("<br>", " "))
          .text();
      }
      if (options.site.host === "pt.sjtu.edu.cn") {
        if (time.match(/\d+[分时天月年]/g)) {
          time = Date.now() - this._parseTime(time)
          time = new Date(time).toLocaleString("zh-CN", { hour12: false }).replace(/\//g, '-')
        }
      }
      return time || "";
    }

}
