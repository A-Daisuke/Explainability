function __method_wrapper__() {
  async reportResourceConflict(resourceId: string, agents: string[]): Promise<ResourceConflict> {
    const conflict: ResourceConflict = {
      id: `conflict-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      resourceId,
      agents,
      timestamp: new Date(),
      resolved: false,
    };

    this.conflicts.set(conflict.id, conflict);
    this.logger.warn('Resource conflict reported', conflict);

    // Emit conflict event
    this.eventBus.emit('conflict:resource', conflict);

    return conflict;
  }

}
