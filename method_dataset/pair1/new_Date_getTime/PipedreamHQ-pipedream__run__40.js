function __method_wrapper__() {
  async run() {
    let newLastCreatedTime = this.getLastCreatedTime();
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.getResourceFn(),
    });
    for await (const item of resourcesStream) {
      const createdTime = new Date(item[this.getTimeKey()]).getTime();
      if (this.compareFn(item)) {
        this.$emit(
          item,
          {
            id: item[this.getIdKey()],
            summary: this.getSummary(item),
            ts: createdTime,
          },
        );
      }
      if (newLastCreatedTime < createdTime) {
        newLastCreatedTime = createdTime;
      }
    }
    this.setLastCreatedTime(newLastCreatedTime);
  },

}
