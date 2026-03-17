function __method_wrapper__() {
  completeTask(taskId: string, result: TaskResult): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = 'completed';
      task.endTime = new Date().toISOString();
      task.duration = task.startTime ? Date.now() - new Date(task.startTime).getTime() : 0;
      task.result = result;
      task.output = result.output;
      task.artifacts = result.artifacts;

      // Update agent completion count
      if (task.assignedAgent) {
        const agent = this.agents.get(task.assignedAgent);
        if (agent) {
          agent.tasksCompleted++;
        }
      }
    }
  }

}
