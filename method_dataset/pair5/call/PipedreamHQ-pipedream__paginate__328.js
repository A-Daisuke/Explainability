function __method_wrapper__() {
    async paginate({
      fn, ...opts
    }) {
      const objects = [];
      let cursor;

      do {
        const response = await fn.call(this, ({
          ...opts,
          params: {
            ...opts.params,
            cursor,
          },
        }));
        if (response.objects) objects.push(...response.objects);
        cursor = response.cursor;
      } while (cursor);

      return {
        objects,
      };
    },

}
