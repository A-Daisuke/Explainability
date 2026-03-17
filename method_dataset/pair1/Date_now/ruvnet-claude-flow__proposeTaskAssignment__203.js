function __method_wrapper__() {
  async proposeTaskAssignment(taskId: string, agentId: string): Promise<HiveDecision> {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    const decision: HiveDecision = {
      id: generateId('decision'),
      type: 'task_assignment',
      proposal: { taskId, agentId },
      votes: new Map(),
      result: 'pending',
      timestamp: Date.now(),
    };

    this.decisions.set(decision.id, decision);
    task.status = 'voting';

    this.emit('decision:proposed', decision);

    return decision;
  }

}
