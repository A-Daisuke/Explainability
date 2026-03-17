function __method_wrapper__() {
  getOrchestratorMetrics(): {
    global: SwarmMetrics;
    swarms: Record<string, SwarmMetrics>;
    system: {
      activeSwarms: number;
      totalAgents: number;
      totalTasks: number;
      uptime: number;
      memoryUsage: number;
      cpuUsage: number;
    };
  } {
    const swarmMetrics: Record<string, SwarmMetrics> = {};
    for (const [swarmId, context] of this.activeSwarms) {
      swarmMetrics[swarmId] = context.metrics;
    }

    return {
      global: this.globalMetrics,
      swarms: swarmMetrics,
      system: {
        activeSwarms: this.activeSwarms.size,
        totalAgents: Array.from(this.activeSwarms.values())
          .reduce((sum, ctx) => sum + ctx.agents.size, 0),
        totalTasks: Array.from(this.activeSwarms.values())
          .reduce((sum, ctx) => sum + ctx.tasks.size, 0),
        uptime: this.isRunning ? Date.now() - performance.timeOrigin : 0,
        memoryUsage: process.memoryUsage().heapUsed,
        cpuUsage: process.cpuUsage().user,
      },
    };
  }

}
