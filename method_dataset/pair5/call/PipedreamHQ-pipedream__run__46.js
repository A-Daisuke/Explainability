class __C__ {
  async run() {
    let offset = 0;

    while (true) {
      const lastDate = this._getLastDate();
      const currentDate = new Date();

      const { objects } = await this.listingFunction().call(this, {
        paginate: true,
        params: {
          offset,
          limit: constants.MAX_LIMIT,
          created__gte: lastDate,
        },
      });

      this._setLastDate(currentDate);
      offset += objects.length;

      if (objects.length === 0) {
        return;
      }

      for (const object of objects) {
        this.emitEvent(object);
      }
    }
  },

}
