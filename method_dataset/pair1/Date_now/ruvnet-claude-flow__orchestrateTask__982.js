class __C__ {
  async orchestrateTask(task, strategy = 'parallel', metadata = {}) {
    const taskId = metadata.taskId || `task-${Date.now()}`;
    const swarmId = metadata.swarmId || 'default-swarm';
    const complexity = metadata.complexity || 'medium';

    // Store task information
    await this.storeMemory(
      swarmId,
      `task-${taskId}`,
      {
        id: taskId,
        task,
        strategy,
        status: 'pending',
        priority: metadata.priority || 5,
        complexity,
        createdAt: Date.now(),
      },
      'task',
    );

    // Adjust monitoring frequency based on task complexity
    const monitoringInterval =
      {
        low: 10000,
        medium: 5000,
        high: 2000,
      }[complexity] || 5000;

    const batch = [
      {
        tool: 'task_orchestrate',
        params: {
          task,
          strategy,
          taskId,
          priority: metadata.priority || 5,
          estimatedDuration: metadata.estimatedDuration || 30000,
        },
      },
      {
        tool: 'swarm_monitor',
        params: {
          interval: monitoringInterval,
          taskId,
          metrics: ['performance', 'progress', 'bottlenecks'],
        },
      },
      // Add performance tracking for high-priority tasks
      ...(metadata.priority > 7
        ? [
            {
              tool: 'performance_report',
              params: { format: 'detailed', taskId },
            },
          ]
        : []),
    ];

    const results = await this.executeParallel(batch);

    // Update task status
    await this.storeMemory(
      swarmId,
      `task-${taskId}`,
      {
        id: taskId,
        task,
        strategy,
        status: 'in_progress',
        priority: metadata.priority || 5,
        complexity,
        createdAt: Date.now(),
      },
      'task',
    );

    return results;
  }

}
