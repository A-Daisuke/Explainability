function __method_wrapper__() {
  public run() {
    if (this.isRunning) {
      return this;
    }

    clearTimeout(this.timer);

    const queue = this.queues.shift();

    if (queue) {
      this.isRunning = true;
      const timout = (this.service.options.batchDownloadInterval || 0) * 1000;

      const sender = queue.clientId
        ? this.service.controller.sendTorrentToClient
        : this.service.controller.sendTorrentToDefaultClient;

      sender
        .call(this.service.controller, queue)
        .then(() => {
          this.successCount++;
        })
        .catch(error => {
          console.log(error);
          this.failedCount++;
        })
        .finally(() => {
          this.isRunning = false;
          // 是否设置了时间间隔
          if (timout > 0) {
            this.timer = window.setTimeout(() => {
              this.run();
            }, timout);
          } else {
            this.run();
          }
        });
    } else {
      PPF.showNotifications(
        {
          message: this.service.i18n.t(
            "service.controller.downloadTaskIsCompleted",
            {
              success: this.successCount,
              failed: this.failedCount
            }
          )
        },
        10000
      );

      this.successCount = 0;
      this.failedCount = 0;
    }

    return this;
  }

}
