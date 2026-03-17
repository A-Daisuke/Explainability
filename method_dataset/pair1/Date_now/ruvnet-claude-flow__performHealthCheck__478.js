function __method_wrapper__() {
  async performHealthCheck(): Promise<{
    healthy: boolean;
    issues: string[];
    metrics: any;
    timestamp: Date;
  }> {
    const issues: string[] = [];
    const startTime = performance.now();

    try {
      // Check orchestrator health
      if (!this.isRunning) {
        issues.push('Orchestrator is not running');
      }

      // Check coordinator health
      if (!this.coordinator) {
        issues.push('Coordinator is not initialized');
      }

      // Check memory manager health
      try {
        await this.memoryManager.store({
          id: 'health-check',
          agentId: 'orchestrator',
          type: 'health-check',
          content: 'Health check test',
          namespace: 'health',
          timestamp: new Date(),
          metadata: { test: true },
        });
      } catch (error) {
        issues.push('Memory manager health check failed');
      }

      // Check swarm health
      for (const [swarmId, context] of this.activeSwarms) {
        if (context.objective.status === 'failed') {
          issues.push(`Swarm ${swarmId} is in failed state`);
        }

        // Check for stalled swarms
        const swarmAge = Date.now() - context.startTime.getTime();
        if (swarmAge > 3600000 && context.objective.status === 'executing') { // 1 hour
          issues.push(`Swarm ${swarmId} appears to be stalled`);
        }
      }

      const healthy = issues.length === 0;
      const duration = performance.now() - startTime;

      return {
        healthy,
        issues,
        metrics: {
          checkDuration: duration,
          activeSwarms: this.activeSwarms.size,
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage(),
        },
        timestamp: new Date(),
      };

    } catch (error) {
      issues.push(`Health check failed: ${error instanceof Error ? error.message : String(error)}`);
      return {
        healthy: false,
        issues,
        metrics: {},
        timestamp: new Date(),
      };
    }
  }

}
