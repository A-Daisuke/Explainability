class __C__ {
    async getAndProcessData() {
      const currentRun: number = Date.now();
      const lastRun: Date = this.getLastRun();
      const items: EntityWithCreateTime[] = await this.getItems();
      console.log("Number of reviews: ", items.length);
      this.setLastRun(currentRun);

      const filteredItems = (lastRun
        ? items?.filter(({ createTime }) => new Date(createTime) >= lastRun)
        : items?.slice(-10)) ?? [];

      filteredItems.reverse().forEach((item) => {
        this.$emit(item, {
          id: this.app.getCleanName(item.name),
          summary: this.getSummary(item),
          ts: new Date(item.createTime),
        });
      });
    },

}
