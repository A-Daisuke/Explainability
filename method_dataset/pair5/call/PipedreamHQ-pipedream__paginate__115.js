class __C__ {
    async paginate({
      fn, ...opts
    }) {
      const data = [];
      opts.params = {
        ...opts.params,
        limit: constants.MAX_LIMIT,
      };

      while (true) {
        const response = await fn.call(this, opts);
        data.push(...response.data);
        opts.params.startingAfter = this.getLastId(data);
        if (!response.hasMore) {
          break;
        }
      }

      return {
        data,
      };
    },

}
