function __method_wrapper__() {
    async deploy() {
      const response = await this.drata.listVendors({
        paginate: true,
        // this endpoint does not support custom sorting by creation date
      });

      const visitedIds = {};
      for (const vendor of response.data) {
        visitedIds[vendor.id] = new Date(vendor.updatedAt).getTime();
      }
      this._setVisitedIds(visitedIds);

      const historical = this.sortByUpdatedDate(response.data)
        .slice(-constants.DEPLOY_LIMIT)
        .reverse();

      for (const vendor of historical) {
        this.$emit(vendor, {
          id: vendor.id,
          summary: `Historical vendor added event: ${vendor.name}`,
          ts: vendor.updatedAt,
        });
      }
    },

}
