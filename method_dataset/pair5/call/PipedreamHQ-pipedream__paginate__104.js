function __method_wrapper__() {
    async paginate({
      fn, ...opts
    }) {
      const results = [];
      const limit = constants.MAX_LIMIT;
      let offset = 0;

      while (true) {
        const {
          meta,
          objects,
        } = await fn.call(this, {
          ...opts,
          params: {
            ...opts.params,
            limit,
            offset,
          },
        });

        results.push(...objects);
        offset += limit;

        if (!meta.next) {
          return {
            meta,
            objects: results,
          };
        }
      }
    },

}
