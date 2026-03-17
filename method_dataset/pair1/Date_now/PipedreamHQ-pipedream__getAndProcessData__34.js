function __method_wrapper__() {
    async getAndProcessData(emit = true) {
      const lastId = this._getLastId();
      const { result } = await this.reputationLyncs.listCustomers({
        data: {
          created_after_id: lastId,
        },
      });

      let lastCustomerDate = 0, lastCustomerId;
      const ts = Date.now();
      result?.forEach?.((customer) => {
        const id = customer.customerId;

        if (emit) {
          this.$emit(customer, {
            id,
            summary: `New Customer: ${
              customer.customer_email || customer.customer_name || id
            }`,
            ts,
          });
        }

        const date = new Date(customer.created_date.split(" ").join("T") + "Z").valueOf();
        if (date > lastCustomerDate) {
          lastCustomerDate = date;
          lastCustomerId = id;
        }
      });

      if (lastCustomerId) this._setLastId(lastCustomerId);
    },

}
