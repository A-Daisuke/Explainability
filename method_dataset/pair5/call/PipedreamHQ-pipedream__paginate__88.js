function __method_wrapper__() {
    async paginate({
      fn, ...opts
    }) {
      const data = [];
      opts.params = {
        ...opts.params,
        per_page: 1000,
        page: 1,
      };

      while (true) {
        const response = await fn.call(this, opts);
        data.push(...response.data);
        opts.params.page++;

        if (this.isLastPage(response)) {
          return {
            data,
            meta: response.meta,
          };
        }
      }
    },

}
