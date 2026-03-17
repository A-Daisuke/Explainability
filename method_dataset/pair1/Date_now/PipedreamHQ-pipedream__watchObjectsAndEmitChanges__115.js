class __C__ {
    async watchObjectsAndEmitChanges(objectType, objectsToEmit, queryTypes) {
      // Get the timestamp of the last run, if available. Else set the start time to 1 day ago
      const lastRun = this._getLastMaxTimestamp() ?? +Date.now() - (1000 * 60 * 60 * 24);
      console.log(`Max ts of last run: ${lastRun}`);

      const newMaxTs = await this.snowflake.maxQueryHistoryTimestamp();
      console.log(`New max ts: ${newMaxTs}`);

      const results = await this.snowflake.getChangesForSpecificObject(
        lastRun,
        newMaxTs,
        objectType,
      );
      console.log(`Raw results: ${JSON.stringify(results, null, 2)}`);
      this.filterAndEmitChanges(results, objectType, objectsToEmit, queryTypes);
      this._setLastMaxTimestamp(newMaxTs);
    },

}
