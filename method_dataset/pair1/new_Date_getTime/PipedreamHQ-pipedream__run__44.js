function __method_wrapper__() {
  async run() {
    const items = [], comparison = this.getComparisonType();
    const resources = this.app.paginate({
      fn: this.getResourceFn(),
      params: this.getResourceFnParams(),
    });
    for await (const item of resources) {
      items.push(item);
    }
    if (comparison == "last") {
      let lastCreatedTime = this.getLastCreatedTime();
      let newLastCreatedTime = lastCreatedTime;
      for (let item of items) {
        const createdTime = new Date(item.created_at).getTime();
        if (lastCreatedTime < createdTime) {
          let detailedItem = await this.getItem(item);
          this.$emit(detailedItem, this.getMeta(detailedItem));
        }
        if (newLastCreatedTime < createdTime) {
          newLastCreatedTime = createdTime;
        }
        this.setLastCreatedTime(newLastCreatedTime);
      }
    } else if (comparison == "include") {
      let ids = this.getIds();
      for (let item of items) {
        if (!ids.includes(item.id)) {
          let detailedItem = await this.getItem(item);
          ids.push(item.id);
          this.$emit(detailedItem, this.getMeta(detailedItem));
        }
      }
      this.setIds(ids);
    }
  },

}
