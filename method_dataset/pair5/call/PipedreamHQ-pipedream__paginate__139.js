function __method_wrapper__() {
    async paginate({
      fn, dataType, ...opts
    }) {
      const data = [];
      opts.params = {
        ...opts.params,
        pageSize: constants.MAX_PAGE_SIZE,
        page: 0,
      };

      while (true) {
        const response = await fn.call(this, opts);
        data.push(...response[dataType]);
        opts.params.page++;

        if (data.length >= response.total_count) {
          return {
            data,
          };
        }
      }
    },

}
