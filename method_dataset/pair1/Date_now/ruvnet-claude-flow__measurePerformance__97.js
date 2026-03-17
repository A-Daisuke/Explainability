function __method_wrapper__() {
  static async measurePerformance<T>(
    operation: () => Promise<T>,
    iterations: number = 100
  ): Promise<{
    averageTime: number;
    minTime: number;
    maxTime: number;
    totalTime: number;
    successCount: number;
    errorCount: number;
    throughput: number;
  }> {
    const times: number[] = [];
    let successCount = 0;
    let errorCount = 0;
    const startTime = Date.now();

    for (let i = 0; i < iterations; i++) {
      const operationStart = Date.now();
      
      try {
        await operation();
        const operationTime = Date.now() - operationStart;
        times.push(operationTime);
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    const totalTime = Date.now() - startTime;
    const averageTime = times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0;
    const minTime = times.length > 0 ? Math.min(...times) : 0;
    const maxTime = times.length > 0 ? Math.max(...times) : 0;
    const throughput = iterations / (totalTime / 1000); // requests per second

    return {
      averageTime,
      minTime,
      maxTime,
      totalTime,
      successCount,
      errorCount,
      throughput
    };
  }

}
