function __method_wrapper__() {
    async paginate({
      fn, ...opts
    }) {
      const limit = constants.MAX_LIMIT;
      let offset = 0;
      const objects = [];

      while (true) {
        const { results } = await fn.call(this, {
          ...opts,
          params: {
            ...opts?.params,
            limit,
            offset,
          },
        });

        if (results.length === 0) break;
        objects.push(...results);
        offset += limit;
      }
      return {
        results: objects,
      };
    },

}
