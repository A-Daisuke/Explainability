class __C__ {
    async paginate({
      fn, ...opts
    }) {
      let offset = 0;
      const limit = constants.MAX_LIMIT;
      const data = [];

      while (true) {
        const response = await fn.call(this, {
          ...opts,
          params: {
            ...opts.params,
            limit,
            offset,
          },
        });

        if (response.length === 0) {
          return data;
        }

        data.push(...response);
        offset += limit;
      }
    },

}
