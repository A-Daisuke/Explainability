class __C__ {
    async syncResources(db, resourceTypes, $ = null) {
      const syncToken = db
        ? this._getSyncToken(db) || "*"
        : "*";
      const result = await this.sync({
        $,
        opts: {
          resource_types: JSON.stringify(resourceTypes),
          sync_token: syncToken,
        },
      });
      if (db) {
        this._setSyncToken(db, result.sync_token);
      }
      return result;
    },

}
