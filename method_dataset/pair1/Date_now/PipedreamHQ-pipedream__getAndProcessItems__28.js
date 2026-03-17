class __C__ {
    async getAndProcessItems(emit = true) {
      const savedItems = this._getSavedItems();
      const items = await this.outscraper.getRequests();

      const idsToEmit = items.map(({ id }) => id).filter((id) => !savedItems.includes(id));

      const ts = Date.now();
      const promises = idsToEmit.map((id) => async () => {
        if (emit) {
          const { data } = await this.outscraper.getRequestData(id);
          this.$emit(data, {
            id,
            summary: `New task: ${id}`,
            ts,
          });
        }
        savedItems.push(id);
      });

      await Promise.allSettled(promises);
      this._setSavedItems(savedItems);
    },

}
