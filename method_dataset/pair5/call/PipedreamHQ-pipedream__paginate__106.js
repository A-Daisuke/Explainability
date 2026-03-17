class __C__ {
    async paginate({
      fn, ...opts
    }) {
      const { total } = await fn.call(this, {
        ...opts,
        params: {
          ...opts.params,
          limit: 1,
        },
      });

      const promises = [];
      const numberOfPages = Math.ceil(total / constants.PAGINATION_LIMIT);
      for (let page = 1; page <= numberOfPages; page++) {
        promises.push(fn.call(this, {
          ...opts,
          params: {
            ...opts.params,
            limit: constants.PAGINATION_LIMIT,
            page,
          },
        }));
      }

      const responses = await Promise.all(promises);
      const results = responses.reduce((results, { data }) => ([
        ...results,
        ...data,
      ]), []);

      return {
        data: results,
        page: numberOfPages,
        total,
      };
    },

}
