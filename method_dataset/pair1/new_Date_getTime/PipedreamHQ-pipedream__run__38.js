function __method_wrapper__() {
  async run() {
    let newLastFetchTime = this.getLastFetchTime();
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceKey: this.getResourceKey(),
    });
    for await (const item of resourcesStream) {
      const createdTime = new Date(item[this.getDateKey()]).getTime();
      if (this.compareFn(item)) {
        this.$emit(
          item,
          {
            id: item.id,
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
