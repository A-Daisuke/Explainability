class __C__ {
    async deploy() {
      this._setLastTimestamp(new Date().getTime());

      const records = await this.ninox.getRecords({
        teamId: this.teamId,
        databaseId: this.databaseId,
        tableId: this.tableId,
      });

      if (this.getTimestampField() == "modifiedAt") {
        records.filter((record) => record.createdAt !== record.modifiedAt).slice(-20)
          .reverse()
          .forEach(this.emitEvent);
      } else {
        records.slice(-20).reverse()
          .forEach(this.emitEvent);
      }

    },

}
