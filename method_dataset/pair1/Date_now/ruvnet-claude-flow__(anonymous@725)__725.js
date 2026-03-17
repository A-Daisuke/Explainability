function __method_wrapper__() {
    setInterval(() => {
      const now = Date.now();
      const expired: string[] = [];

      for (const [key, result] of this.executionCache) {
        const age = now - result.metadata.timestamp.getTime();
        if (age > this.config.cacheTimeout) {
          expired.push(key);
        }
      }

      expired.forEach(key => this.executionCache.delete(key));
      
      if (expired.length > 0) {
        this.logger.debug('Cleaned up expired cache entries', { 
          count: expired.length 
        });
      }
    }, 300000); // 5 minutes

}
