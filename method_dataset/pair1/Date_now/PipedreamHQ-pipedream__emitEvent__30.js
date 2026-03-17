class __C__ {
    async emitEvent(maxResults = false) {
      const lastNumber = this._getLastNumber();

      const response = this.app.paginate({
        fn: this.app.listBookings,
        params: {
          order: "desc",
          order_by: "id",
        },
      });

      let responseArray = [];
      for await (const item of response) {
        const numbers = item.number.split("/");
        if (checkNumbers(numbers, lastNumber)) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastNumber(responseArray[0].number.split("/"));
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: `New Booking: ${item.id}`,
          ts: Date.now(),
        });
      }
    },

}
