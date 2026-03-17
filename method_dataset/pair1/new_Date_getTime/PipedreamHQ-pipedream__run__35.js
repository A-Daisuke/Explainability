function __method_wrapper__() {
  async run() {
    let lastCretatedTime = this.getLastCretatedTime();
    let newLastCreatedTime = lastCretatedTime;
    const resp = await this.getResourceFn()({
      ...this.getResourceFnArgs(),
    });
    const resources = this.getResourceKey()
      .split(".")
      .reduce((acc, curr) => acc?.[curr], resp);
    for (const item of resources) {
      const createdTime = new Date(item.created_at).getTime();
      if (lastCretatedTime < createdTime) {
        this.$emit(
          item,
          {
            id: createdTime,
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
