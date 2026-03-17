function __method_wrapper__() {
  async createTask(description, priority = 5, metadata = {}) {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 11); // Use substring instead of substr
    const taskId = `task-${timestamp}-${randomPart}`;
    const createdAt = Date.now();

    const task = {
      id: taskId,
      swarmId: this.state.swarmId,
      description,
      priority,
      status: 'pending',
      createdAt: new Date(createdAt).toISOString(),
      assignedTo: null,
      result: null,
      metadata: {
        estimatedDuration: this._estimateTaskDuration(description),
        complexity: this._analyzeTaskComplexity(description),
        ...metadata,
      },
    };

    // Parallel operations: task storage, orchestration, and worker finding
    const [orchestrateResult, bestWorker] = await Promise.all([
      this.mcpWrapper.orchestrateTask(description, 'adaptive'),
      this._findBestWorkerAsync(task),
      // Store task immediately in parallel
      (async () => {
        this.state.tasks.set(task.id, task);
        await this.mcpWrapper.storeMemory(this.state.swarmId, `task-${task.id}`, task, 'task');
      })(),
    ]);

    task.orchestrationId = orchestrateResult[0].taskId;

    this.emit('task:created', task);

    // Assign task if worker available
    if (bestWorker) {
      // Use non-blocking assignment
      setImmediate(() => this._assignTask(bestWorker.id, task.id));
    }

    return task;
  }

}
