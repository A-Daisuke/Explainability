function __method_wrapper__() {
  async run() {
    const savedItems = this._getSavedItems();
    const ts = Date.now();
    const stats = await this.getTrafficStats();
    stats?.trafficStats?.filter(({ name }) => !savedItems.includes(name)).forEach((item) => {
      const id = item.name;
      if (this.matchesCriteria(item)) {
        this.$emit(item, {
          id,
          summary: `Matched Traffic Stats: ${id}`,
          ts,
        });
        savedItems.push(id);
      }
    });
    this._setSavedItems(savedItems);
  },

}
