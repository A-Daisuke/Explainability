class __C__ {
  async run() {
    const visitedIds = this._getVisitedIds();

    const response = await this.drata.listVendors({
      paginate: true,
    });

    for (const vendor of this.sortByUpdatedDate(response.data)) {
      const ts = new Date(vendor.updatedAt).getTime();
      if (!visitedIds[vendor.id] || visitedIds[vendor.id] !== ts) {
        visitedIds[vendor.id] = ts;
        this.$emit(vendor, {
          id: vendor.id,
          summary: `Vendor updated: ${vendor.name}`,
          ts,
        });
      }
    }

    this._setVisitedIds(visitedIds);
  },

}
