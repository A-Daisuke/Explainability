class __C__ {
    async maybeCached(key, refreshVal) {
      let [
        cacheObj,
        wasUpdated,
      ] = this.getCache();
      let record = cacheObj[key];
      const time = Date.now();
      if (!record || time - record.ts > NAME_CACHE_TIMEOUT) {
        record = {
          ts: time,
          val: await refreshVal(),
        };
        cacheObj[key] = record;
        wasUpdated = true;
      }

      if (wasUpdated) {
        this._setNameCache(cacheObj);
      }

      return record.val;
    },

}
