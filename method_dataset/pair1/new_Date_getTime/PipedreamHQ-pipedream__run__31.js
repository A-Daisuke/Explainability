class __C__ {
  async run() {
    const config: SourceConfig = this.getConfig();
    let newLastCreatedTime = this.getLastCreatedTime();
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getRequestMethod(config.resourceFnName),
      resourceName: config.resourceName,
      hasPaging: config.hasPaging,
    });
    for await (const item of resourcesStream) {
      const createdTime = new Date(item.created_at).getTime();
      if (createdTime > this.getLastCreatedTime()) {
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
    this.setLastCreatedTime(newLastCreatedTime);
  },

}
