class __C__ {
    getCache() {
      let cacheObj = this._getNameCache();

      const lastCacheCleanup = this._getLastCacheCleanup();
      const time = Date.now();

      const shouldCleanCache = time - lastCacheCleanup > NAME_CACHE_TIMEOUT / 2;
      if (shouldCleanCache) {
        cacheObj = this.cleanCache(cacheObj);
        this._setLastCacheCleanup(time);
      }

      return [
        cacheObj,
        shouldCleanCache,
      ];
    },

}
