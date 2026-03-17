function __method_wrapper__() {
  private async createSnapshot(
    context: VerificationContext, 
    phase: string
  ): Promise<void> {
    const snapshot: StateSnapshot = {
      id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      phase,
      state: JSON.parse(JSON.stringify(context.state)),
      metadata: JSON.parse(JSON.stringify(context.metadata))
    };

    if (!this.snapshots.has(context.taskId)) {
      this.snapshots.set(context.taskId, []);
    }

    this.snapshots.get(context.taskId)!.push(snapshot);
    context.snapshots.push(snapshot);

    logger.debug(`Created snapshot '${snapshot.id}' for task '${context.taskId}' in phase '${phase}'`);
  }

}
