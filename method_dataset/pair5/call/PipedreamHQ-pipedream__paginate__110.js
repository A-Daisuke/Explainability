function __method_wrapper__() {
    async paginate({
      fn, dataName, ...opts
    }) {
      const data = [];

      while (true) {
        const response = await fn.call(this, opts);
        data.push(...response[dataName]);

        const next = response.links.find((link) => link.name === "next");
        if (!next) {
          break;
        }

        opts.params = {
          _: next.href.split("=")[1],
        };
      }

      return {
        [dataName]: data,
      };
    },

}
