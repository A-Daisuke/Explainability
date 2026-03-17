function __method_wrapper__() {
  private async collectMetrics(): Promise<SystemMetrics> {
    const timestamp = Date.now();
    
    try {
      const [memInfo, cpuInfo, diskInfo] = await Promise.all([
        this.getMemoryInfo(),
        this.getCpuInfo(),
        this.getDiskInfo()
      ]);

      return {
        timestamp,
        errors: {
          count: 0, // Would be tracked by error handler
          rate: 0,
          recent: []
        },
        performance: {
          memory: memInfo,
          cpu: cpuInfo,
          disk: diskInfo,
          network: { in: 0, out: 0 }
        },
        health: {
          status: 'healthy',
          score: 100,
          checks: []
        }
      };
      
    } catch (error) {
      return {
        timestamp,
        errors: { count: 1, rate: 1, recent: [error as Error] },
        performance: {
          memory: { used: 0, total: 0, percentage: 0 },
          cpu: { usage: 0, load: [0, 0, 0] },
          disk: { used: 0, total: 0, free: 0 },
          network: { in: 0, out: 0 }
        },
        health: {
          status: 'critical',
          score: 0,
          checks: [{ name: 'metrics_collection', status: 'fail', message: error?.toString() || 'Unknown error', duration: 0 }]
        }
      };
    }
  }

}
