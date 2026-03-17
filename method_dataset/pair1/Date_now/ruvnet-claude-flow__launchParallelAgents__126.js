export async function launchParallelAgents(
  tasks: Array<{
    agentType: string;
    objective: string;
    mode?: string;
    configuration?: Record<string, unknown>;
    memoryKey?: string;
    batchOptimized?: boolean;
  }>,
  coordinator?: any,
): Promise<string[]> {
  if (!coordinator) {
    throw new Error('TaskCoordinator instance required for agent launching');
  }

  const context = {
    sessionId: `session-${Date.now()}`,
    coordinationMode: 'distributed',
  };

  return await coordinator.launchParallelAgents(tasks, context);
}
