function __method_wrapper__() {
  async getFullStatus(): Promise<SwarmStatus> {
    const agents = Array.from(this.agents.values());
    const tasks = await this.db.getTasks(this.id);
    const memoryStats = await this.memory.getStats();
    const communicationStats = await this.communication.getStats();

    // Calculate agent statistics
    const agentsByType = agents.reduce(
      (acc, agent) => {
        acc[agent.type] = (acc[agent.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Calculate task statistics
    const taskStats = {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      inProgress: tasks.filter((t) => t.status === 'in_progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      failed: tasks.filter((t) => t.status === 'failed').length,
    };

    // Calculate performance metrics
    const performance = await this.calculatePerformanceMetrics();

    // Determine health status
    const health = this.determineHealth(agents, tasks, performance);

    // Get any warnings
    const warnings = this.getSystemWarnings(agents, tasks, performance);

    return {
      swarmId: this.id,
      name: this.config.name,
      topology: this.config.topology,
      queenMode: this.config.queenMode,
      health,
      uptime: Date.now() - this.startTime,
      agents: agents.map((a) => ({
        id: a.id,
        name: a.name,
        type: a.type,
        status: a.status,
        currentTask: a.currentTask,
        messageCount: a.messageCount,
        createdAt: a.createdAt.getTime(),
      })),
      agentsByType,
      tasks: tasks.map((t) => ({
        id: t.id,
        description: t.description,
        status: t.status,
        priority: t.priority,
        progress: t.progress,
        assignedAgent: t.assigned_agents ? JSON.parse(t.assigned_agents)[0] : null,
      })),
      taskStats,
      memoryStats,
      communicationStats,
      performance,
      warnings,
    };
  }

}
