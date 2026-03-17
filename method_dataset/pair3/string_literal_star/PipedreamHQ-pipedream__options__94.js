function __method_wrapper__() {
      async options({
        page, prevContext: { hasMore },
      }) {
        if (hasMore === false) {
          return [
            {
              label: "All Numbers",
              value: "*",
            },
          ];
        }
        const {
          data: { data },
          next_page_url: nextPageUrl,
        } = await this.getNumbers({
          params: {
            page: page + 1,
            limit: constants.DEFAULT_LIMIT,
          },
        });
        const options = data?.map(({ dedicated_number: value }) => value) || [];
        return {
          options,
          context: {
            hasMore: !!nextPageUrl,
          },
        };
      },

}
