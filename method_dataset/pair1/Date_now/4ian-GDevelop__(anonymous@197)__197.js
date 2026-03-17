function __method_wrapper__() {
    return new Promise((resolve, reject) => {
      try {
        const transaction = database.transaction(objectStoreScope, 'readwrite');
        const key = ProjectCache._stringifyCacheKey(cacheKey);
        transaction.oncomplete = event => {
          resolve();
        };
        transaction.onerror = event => {
          console.error('An error occurred while writing to indexedDB:', event);
          reject(event);
        };
        transaction.objectStore(objectStoreScope).put({
          [keyName]: key,
          project: serializeToJSON(project),
          createdAt: Date.now(),
        });
      } catch (error) {
        // An error might occur when opening the transaction (if the object store
        // does not exist for instance).
        console.error('An error occurred while writing to indexedDB:', error);
        reject(error);
      }
    });

}
