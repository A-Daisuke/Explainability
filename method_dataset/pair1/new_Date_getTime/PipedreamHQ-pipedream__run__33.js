class __C__ {
  async run() {
    let lastCretatedTime = this.getLastCretatedTime();
    let newLastCreatedTime = lastCretatedTime;
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
    });
    for await (const item of resourcesStream) {
      const createdTime = new Date(item.creation_date).getTime();
      if (lastCretatedTime < createdTime) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: this.getSummary(item),
            ts: createdTime,
          },
        );
      }
      if (newLastCreatedTime < createdTime) {
        newLastCreatedTime = createdTime;
      }
    }
    this.setLastCretatedTime(newLastCreatedTime);
  },

}
