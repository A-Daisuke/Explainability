function __method_wrapper__() {
  async createCheckpoint(
    description: string, 
    scope: CheckpointScope,
    agentId?: string,
    taskId?: string,
    validations: Validation[] = []
  ): Promise<string> {
    const checkpointId = this.generateCheckpointId();
    const timestamp = Date.now();
    
    // Capture current system state
    const stateSnapshot = await this.captureSystemState(scope, agentId, taskId);
    
    const checkpoint: Checkpoint = {
      id: checkpointId,
      type: 'during', // Default type, can be overridden
      agent_id: agentId || 'system',
      task_id: taskId || 'system',
      timestamp,
      required: true,
      validations,
      state_snapshot: stateSnapshot,
      description,
      scope
    };

    // Store checkpoint
    await this.storeCheckpoint(checkpoint);
    
    console.log(`✅ Checkpoint created: ${checkpointId} (${description})`);
    return checkpointId;
  }

}
