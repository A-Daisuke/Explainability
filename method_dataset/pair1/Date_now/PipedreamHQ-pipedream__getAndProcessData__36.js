function __method_wrapper__() {
    async getAndProcessData(emit = true) {
      const savedIds = this._getSavedIds();
      const items = await this.getItems();
      const ts = Date.now();
      items?.filter((item) => !savedIds.includes(this.getItemId(item))).sort(this.sortItems)
        .forEach((item) => {
          const id = this.getItemId(item);
          if (emit) {
            this.$emit(item, {
              id,
              summary: this.getSummary(item),
              ts,
            });
          }
          savedIds.push(id);
        });
      this._setSavedIds(savedIds);
    },

}
