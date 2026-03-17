export async function createTaskTodos(
  objective: string,
  options: {
    strategy?: 'research' | 'development' | 'analysis' | 'testing' | 'optimization' | 'maintenance';
    maxTasks?: number;
    batchOptimized?: boolean;
    parallelExecution?: boolean;
    memoryCoordination?: boolean;
  } = {},
  coordinator?: any,
): Promise<any[]> {
  if (!coordinator) {
    throw new Error('TaskCoordinator instance required for todo creation');
  }

  const context = {
    sessionId: `session-${Date.now()}`,
    coordinationMode: options.batchOptimized ? 'distributed' : 'centralized',
  };

  return await coordinator.createTaskTodos(objective, context, options);
}
