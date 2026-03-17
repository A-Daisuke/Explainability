async function updateRollingAverages(
  metric: string,
  value: number,
  context: AgenticHookContext
): Promise<void> {
  const avgKey = `avg:${metric}`;
  const history = await context.memory.cache.get(avgKey) || [];
  
  history.push({ value, timestamp: Date.now() });
  
  // Keep last 1000 values
  if (history.length > 1000) {
    history.shift();
  }
  
  await context.memory.cache.set(avgKey, history);
}
