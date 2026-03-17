async function checkBottleneckRecurrence(
  component: string,
  context: AgenticHookContext
): Promise<{ count: number; timespan: number }> {
  const historyKey = `bottleneck:history:${component}`;
  const history = await context.memory.cache.get(historyKey) || [];
  
  const now = Date.now();
  const dayAgo = now - 86400000;
  
  // Count occurrences in last 24 hours
  const recentOccurrences = history.filter((h: any) => 
    h.timestamp > dayAgo
  );
  
  return {
    count: recentOccurrences.length,
    timespan: 86400000, // 24 hours in ms
  };
}
