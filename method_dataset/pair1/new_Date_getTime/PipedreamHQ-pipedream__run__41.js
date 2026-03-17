class __C__ {
  async run() {
    let newLastFetchTime = this.getLastFetchTime();
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
      resourceKey: this.getResourceKey(),
    });
    for await (const item of resourcesStream) {
      const createdTime = new Date(item[this.getDateKey()]).getTime();
      if (this.compareFn(item)) {
        this.$emit(
          item,
          {
            id: item.number,
            summary: this.getSummary(item),
            ts: createdTime,
          },
        );
      }
      if (newLastFetchTime < createdTime) {
        newLastFetchTime = createdTime;
      }
    }
    this.setLastFetchTime(newLastFetchTime);
  },

}
