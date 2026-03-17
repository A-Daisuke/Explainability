function __method_wrapper__() {
  private async captureSystemState(
    scope: CheckpointScope,
    agentId?: string,
    taskId?: string
  ): Promise<StateSnapshot> {
    const snapshotId = this.generateSnapshotId();
    const timestamp = Date.now();

    const stateScope: StateScope = {
      include_agents: scope !== 'local',
      include_tasks: scope !== 'local',
      include_memory: true,
      include_filesystem: scope === 'system' || scope === 'global',
      include_database: scope === 'system' || scope === 'global',
      agent_filter: agentId ? [agentId] : undefined,
      task_filter: taskId ? [taskId] : undefined
    };

    // Capture different state components based on scope
    const agentStates = stateScope.include_agents ? await this.captureAgentStates(stateScope.agent_filter) : new Map();
    const systemState = stateScope.include_agents ? await this.captureSystemState_Component() : {} as SystemState;
    const taskStates = stateScope.include_tasks ? await this.captureTaskStates(stateScope.task_filter) : new Map();
    const memoryState = stateScope.include_memory ? await this.captureMemoryState() : {} as MemoryState;
    const fileSystemState = stateScope.include_filesystem ? await this.captureFileSystemState() : {} as FileSystemState;
    const databaseState = stateScope.include_database ? await this.captureDatabaseState() : {} as DatabaseState;

    // Calculate checksum for integrity verification
    const checksum = this.calculateStateChecksum({
      agentStates,
      systemState,
      taskStates,
      memoryState,
      fileSystemState,
      databaseState
    });

    const metadata: SnapshotMetadata = {
      version: '2.0',
      created_by: agentId || 'system',
      description: `State snapshot for ${scope} scope`,
      tags: [scope, timestamp.toString()],
      size_bytes: 0, // Will be calculated after serialization
      compression_ratio: 1.0
    };

    const snapshot: StateSnapshot = {
      id: snapshotId,
      timestamp,
      agent_states: agentStates,
      system_state: systemState,
      task_states: taskStates,
      memory_state: memoryState,
      file_system_state: fileSystemState,
      database_state: databaseState,
      checksum,
      metadata
    };

    // Store snapshot
    await this.storeSnapshot(snapshot);

    return snapshot;
  }

}
