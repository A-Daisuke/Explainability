function __method_wrapper__() {
  public start() {
    this.lastTime = +new Date();
    this.startTime = this.lastTime;
    this.statusText = "数据准备中……";

    if (this.timeout > 0) {
      this.xhr.timeout = this.timeout;
    }
    this.xhr.open(this.requestMethod, this.url, true);
    // 指定返回的实体类型"blob"，该类型表示可以为任意文件
    // https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest
    this.xhr.responseType = "blob";
    this.xhr.onreadystatechange = () => {
      switch (this.xhr.readyState) {
        // 下载完成 DONE
        case 4:
          switch (this.xhr.status) {
            case 200:
            case 302:
              this.content = this.xhr.response;
              this.downloadCompleted();
              break;

            default:
              if (this.xhr.status != 0) {
                this.downloadError(
                  `[${this.url}] 下载失败，返回的状态码为：${this.xhr.status}`
                );
              }

              break;
          }

          break;

        // 已获取响应头 HEADERS_RECEIVED
        case 2:
          var contentDisposition = this.xhr.getResponseHeader(
            "Content-Disposition"
          );
          // 从服务端获取文件名
          if (contentDisposition && !this.fileName && !this.getDataOnly) {
            this.fileName = this.getFileName(contentDisposition);
          }
          break;
      }
    };

    // 下载进度事件
    this.xhr.onprogress = (e: ProgressEvent) => {
      // 当前传输字节
      this.loaded = e.loaded;
      // 总字节
      this.total = e.total;
      // 当前进度（百分比）
      this.percent = (100 * (e.loaded / e.total)).toFixed(2);
      // 最后读取时间
      this.lastTime = +new Date();
      // 当前速度
      this.speed = this.loaded / (this.startTime - this.lastTime);
      this.updateProgress();
    };

    // 错误事件
    this.xhr.onerror = e => {
      this.downloadError(e);
    };

    // 超时
    this.xhr.ontimeout = () => {
      this.downloadError(`[${this.url}] 下载超时`);
    };

    var data = null;
    if (this.postData) {
      data = $.param(this.postData);
    }
    if (this.requestMethod == ERequestMethod.POST) {
      this.xhr.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
    }
    // 开始下载
    this.xhr.send(data);
    this.onStart && this.onStart.call(this);
  }

}
