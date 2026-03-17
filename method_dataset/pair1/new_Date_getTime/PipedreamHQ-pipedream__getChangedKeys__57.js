function __method_wrapper__() {
    getChangedKeys(dbObject, queryObject) {
      const changedKeys = [];
      for (const key in dbObject) {
        if (queryObject[key] instanceof Date) {
          if (new Date(dbObject[key]).getTime() != queryObject[key].getTime()) {
            changedKeys.push(key);
          }
          continue;
        }
        if (dbObject[key] != queryObject[key]) {
          changedKeys.push(key);
        }
      }
      return changedKeys;
    },

}
