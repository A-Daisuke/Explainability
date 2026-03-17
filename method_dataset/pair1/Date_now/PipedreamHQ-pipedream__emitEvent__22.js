function __method_wrapper__() {
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();

      const response = this.kiwihr.paginate({
        fn: this.getFunction(),
        fieldName: this.getFieldName(),
        variables: this.getVariables(),
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        if (item.id <= lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastId(responseArray[0].id);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: Date.now(),
        });
      }
    },

}
