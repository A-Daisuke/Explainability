function __method_wrapper__() {
    async listNPSRatings({
      updated_after, numSampleResults,
    }) {
      const npsRatings = [];
      let cursor;
      do {
        const {
          nps_ratings, pagination,
        } = await this._makeRequest({
          path: "/admin/nps_ratings",
          params: {
            per_page: 100, // max allowed by API
            cursor,
            updated_after,
          },
        });
        npsRatings.push(...(nps_ratings || []));
        // When retrieving sample data, return early once we've fetched numSampleResults
        if (numSampleResults && npsRatings.length >= numSampleResults) {
          return npsRatings.slice(0, numSampleResults);
        }
        cursor = pagination.cursor;
      } while (cursor);

      // Calculate the ISO 8601 timestamp of the most recent record, if available
      let maxUpdatedAt;
      if (npsRatings.length) {
        const dates = npsRatings.map((r) => new Date(r.updated_at));
        maxUpdatedAt = new Date(Math.max.apply(null, dates)).toISOString();
      }

      return {
        npsRatings,
        maxUpdatedAt,
      };
    },

}
