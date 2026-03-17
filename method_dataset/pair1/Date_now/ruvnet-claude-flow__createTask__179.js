class __C__ {
  async createTask(description, priority = 'medium', assignedTo = null) {
    if (!this.swarmActive) {
      this.ui.addLog('warning', 'Swarm not active - cannot create task');
      return null;
    }

    const taskId = `task-${Date.now()}`;
    const task = {
      id: taskId,
      description,
      priority,
      assignedTo,
      status: 'pending',
      created: new Date(),
      swarmId: this.swarmId,
    };

    this.tasks.set(taskId, task);
    this.updateSwarmStatus();

    this.ui.addLog('success', `Created task: ${description}`);
    return taskId;
  }

}
