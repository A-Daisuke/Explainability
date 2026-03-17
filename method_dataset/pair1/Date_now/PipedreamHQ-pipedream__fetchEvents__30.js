function __method_wrapper__() {
    async fetchEvents() {
      const params = this.getParams();
      const data = [];
      let page = 0;
      while (true) {
        const res = await this.app.listOrders(page, params);
        if (res.orders.length === 0) {
          break;
        }
        data.push(...res.orders);
        page++;
      }
      this._setLastFetchDate(Date.now());
      return data;
    },

}
