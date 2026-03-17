function __method_wrapper__() {
      return await this.healthCheckCircuitBreaker.execute(async () => {
        const components: Record<string, ComponentHealth> = {};

        // Check all components in parallel
        const [terminal, memory, coordination, mcp] = await Promise.allSettled([
          this.getComponentHealth(
            'Terminal Manager',
            async () => await this.terminalManager.getHealthStatus(),
          ),
          this.getComponentHealth(
            'Memory Manager',
            async () => await this.memoryManager.getHealthStatus(),
          ),
          this.getComponentHealth(
            'Coordination Manager',
            async () => await this.coordinationManager.getHealthStatus(),
          ),
          this.getComponentHealth('MCP Server', async () => await this.mcpServer.getHealthStatus()),
        ]);

        // Process results
        components.terminal = this.processHealthResult(terminal, 'Terminal Manager');
        components.memory = this.processHealthResult(memory, 'Memory Manager');
        components.coordination = this.processHealthResult(coordination, 'Coordination Manager');
        components.mcp = this.processHealthResult(mcp, 'MCP Server');

        // Add orchestrator self-check
        components.orchestrator = {
          name: 'Orchestrator',
          status: 'healthy',
          lastCheck: new Date(),
          metrics: {
            uptime: Date.now() - this.startTime,
            activeAgents: this.agents.size,
            queuedTasks: this.taskQueue.length,
            memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
          },
        };

        // Determine overall status
        const statuses = Object.values(components).map((c) => c.status);
        let overallStatus: HealthStatus['status'] = 'healthy';

        if (statuses.some((s) => s === 'unhealthy')) {
          overallStatus = 'unhealthy';
        } else if (statuses.some((s) => s === 'degraded')) {
          overallStatus = 'degraded';
        }

        return {
          status: overallStatus,
          components,
          timestamp: new Date(),
        };
      });

}
