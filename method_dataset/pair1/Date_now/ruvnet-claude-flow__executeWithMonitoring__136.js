function __method_wrapper__() {
  async executeWithMonitoring<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    if (!this.bridgeConfig.enablePerformanceMonitoring) {
      return await fn();
    }

    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;

    try {
      // Execute pre-operation hooks
      await this.executePerformanceHook('performance-metric', {
        metric: `${operation}_start`,
        value: startTime,
        unit: 'timestamp',
        context: { operation, ...context }
      });

      const result = await fn();
      
      const endTime = Date.now();
      const endMemory = process.memoryUsage().heapUsed;
      const duration = endTime - startTime;
      const memoryDelta = endMemory - startMemory;

      // Record metrics
      await this.reportPerformanceMetric(operation, duration, true, undefined, memoryDelta);

      // Execute post-operation hooks
      await this.executePerformanceHook('performance-metric', {
        metric: `${operation}_complete`,
        value: duration,
        unit: 'milliseconds',
        context: { 
          operation, 
          success: true, 
          memoryDelta: memoryDelta / 1024 / 1024, // MB
          ...context 
        }
      });

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      const memoryDelta = process.memoryUsage().heapUsed - startMemory;

      await this.reportPerformanceMetric(operation, duration, false, error instanceof Error ? error.message : String(error), memoryDelta);

      // Execute error hooks
      await this.executePerformanceHook('performance-metric', {
        metric: `${operation}_error`,
        value: duration,
        unit: 'milliseconds',
        context: { 
          operation, 
          success: false, 
          error: error instanceof Error ? error.message : String(error),
          memoryDelta: memoryDelta / 1024 / 1024, // MB
          ...context 
        }
      });

      throw error;
    }
  }

}
