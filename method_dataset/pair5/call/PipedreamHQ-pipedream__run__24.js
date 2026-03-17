function __method_wrapper__() {
  async run() {
    let offset = this.getOffset();
    const limit = constants.MAX_LIMIT;
    const data = [];

    const {
      fn,
      opts,
    } = this.getListingFunctionOpts();

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
        break;
      }

      offset += limit;
      this.setOffset(offset);
      data.push(...response);
    }

    for (const event of data) {
      this.$emit(event, this.getMeta(event));
    }
  },

}
