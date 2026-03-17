async function updateModelPerformance(
  modelId: string,
  accuracy: number,
  context: AgenticHookContext
): Promise<void> {
  const perfKey = `model:performance:${modelId}`;
  const history = await context.memory.cache.get(perfKey) || [];
  
  history.push({
    accuracy,
    timestamp: Date.now(),
    sessionId: context.sessionId,
  });
  
  // Keep last 100 performance records
  if (history.length > 100) {
    history.shift();
  }
  
  await context.memory.cache.set(perfKey, history);
}
