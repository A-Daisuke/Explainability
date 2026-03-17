function __method_wrapper__() {
  async reportTaskConflict(
    taskId: string,
    agents: string[],
    type: TaskConflict['type'],
  ): Promise<TaskConflict> {
    const conflict: TaskConflict = {
      id: `conflict-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskId,
      agents,
      type,
      timestamp: new Date(),
      resolved: false,
    };

    this.conflicts.set(conflict.id, conflict);
    this.logger.warn('Task conflict reported', conflict);

    // Emit conflict event
    this.eventBus.emit('conflict:task', conflict);

    return conflict;
  }

}
