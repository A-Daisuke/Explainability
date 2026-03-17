class __C__ {
    async activate() {
      console.log("Activating: fetching pages and properties");
      this._setLastUpdatedTimestamp(Date.now());
      const propertyValues = {};
      const propertiesToCheck = await this._getPropertiesToCheck();
      const params = this.lastUpdatedSortParam();
      const pagesStream = this.notion.getPages(this.dataSourceId, params);
      for await (const page of pagesStream) {
        for (const propertyName of propertiesToCheck) {
          const currentValue = this._maybeRemoveFileSubItems(page.properties[propertyName]);
          propertyValues[page.id] = {
            ...propertyValues[page.id],
            [propertyName]: currentValue,
          };
        }
      }
      this._setPropertyValues(propertyValues);
    },

}
