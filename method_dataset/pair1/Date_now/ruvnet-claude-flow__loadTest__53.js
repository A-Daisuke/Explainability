function __method_wrapper__() {
  loadTest: async (fn: () => Promise<any>, options: any) => {
    const startTime = Date.now();
    let totalRequests = 0;
    let successfulRequests = 0;
    const responseTimes: number[] = [];
    
    while (Date.now() - startTime < options.duration) {
      const promises = [];
      for (let i = 0; i < options.maxConcurrency; i++) {
        const reqStart = performance.now();
        promises.push(
          fn().then(() => {
            successfulRequests++;
            responseTimes.push(performance.now() - reqStart);
          }).catch(() => {})
        );
        totalRequests++;
      }
      await Promise.all(promises);
      await AsyncTestUtils.delay(1000 / options.requestsPerSecond);
    }
    
    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    
    return {
      totalRequests,
      successfulRequests,
      averageResponseTime
    };
  }

}
