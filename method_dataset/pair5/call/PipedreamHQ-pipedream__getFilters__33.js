function __method_wrapper__() {
    getFilters() {
      const {
        token,
        amount,
      } = this;
      const filters = common.methods.getFilters.call(this);

      if (token) {
        filters.push({
          type: "token",
          value: token,
        });
      }

      if (amount) {
        filters.push({
          type: "amount",
          value: amount,
        });
      }

      return filters;
    },

}
