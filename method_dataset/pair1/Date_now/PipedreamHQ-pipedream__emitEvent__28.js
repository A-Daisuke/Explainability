class __C__ {
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();

      const response = this.selzy.paginate({
        fn: this.selzy.getCampaigns,
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      responseArray = responseArray.filter((item) => item.id > lastId).sort((a, b) => b.id - a.id);

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }

        this._setLastId(responseArray[0].id);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: `New campaign created: ${item.id}`,
          ts: Date.now(),
        });
      }
    },

}
