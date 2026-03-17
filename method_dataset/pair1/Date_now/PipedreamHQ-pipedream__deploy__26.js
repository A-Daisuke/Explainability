class __C__ {
    async deploy() {
      const { webinars } = await this.app.listWebinars({
        params: {
          page_size: 25,
        },
      });
      if (!webinars || webinars.length === 0) {
        return;
      }
      const objects = this.sortByDate(webinars, "start_time");
      for (const object of objects) {
        const startTime = Date.parse(object.start_time);
        if (startTime < Date.now()) {
          this.emitEvent({
            object,
            time_stamp: startTime,
          }, object);
        }
      }
    },

}
