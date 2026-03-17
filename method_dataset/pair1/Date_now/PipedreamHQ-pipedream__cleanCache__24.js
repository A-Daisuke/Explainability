function __method_wrapper__() {
    cleanCache(cacheObj) {
      console.log("Initiating cache check-up...");
      const timeout = Date.now() - NAME_CACHE_TIMEOUT;

      const entries = Object.entries(cacheObj);
      let cleanArr = entries.filter(
        ([
          , { ts },
        ]) => ts > timeout,
      );
      const diff = entries.length - cleanArr.length;
      if (diff) {
        console.log(`Cleaned up ${diff} outdated cache entries.`);
      }

      if (cleanArr.length > NAME_CACHE_MAX_SIZE) {
        console.log(`Reduced the cache from ${cleanArr.length} to ${NAME_CACHE_MAX_SIZE / 2} entries.`);
        cleanArr = cleanArr.slice(NAME_CACHE_MAX_SIZE / -2);
      }

      const cleanObj = Object.fromEntries(cleanArr);
      return cleanObj;
    },

}
