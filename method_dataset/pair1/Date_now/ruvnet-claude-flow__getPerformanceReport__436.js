export async function getPerformanceReport(timeframe = '24h') {
  const now = Date.now();
  const timeframeMs = parseTimeframe(timeframe);
  const cutoff = now - timeframeMs;
  
  // Filter tasks within timeframe
  const recentTasks = metricsCache.tasks.filter(task => task.timestamp >= cutoff);
  
  // Calculate metrics
  const totalTasks = recentTasks.length;
  const successfulTasks = recentTasks.filter(t => t.success).length;
  const successRate = totalTasks > 0 ? (successfulTasks / totalTasks) * 100 : 0;
  const avgDuration = totalTasks > 0 
    ? recentTasks.reduce((sum, t) => sum + t.duration, 0) / totalTasks 
    : 0;
  
  // Agent metrics
  const agentMetrics = {};
  Object.entries(metricsCache.agents).forEach(([type, data]) => {
    const recentActions = data.actions.filter(a => a.timestamp >= cutoff);
    if (recentActions.length > 0) {
      const successCount = recentActions.filter(a => a.success).length;
      const avgDur = recentActions.reduce((sum, a) => sum + a.duration, 0) / recentActions.length;
      
      agentMetrics[type] = {
        total: recentActions.length,
        successRate: (successCount / recentActions.length) * 100,
        avgDuration: avgDur
      };
    }
  });
  
  // System metrics
  const systemMetrics = await getSystemMetrics();
  
  // Calculate trends (compare to previous period)
  const prevCutoff = cutoff - timeframeMs;
  const prevTasks = metricsCache.tasks.filter(t => t.timestamp >= prevCutoff && t.timestamp < cutoff);
  const prevSuccessRate = prevTasks.length > 0 
    ? (prevTasks.filter(t => t.success).length / prevTasks.length) * 100 
    : 0;
  const prevAvgDuration = prevTasks.length > 0
    ? prevTasks.reduce((sum, t) => sum + t.duration, 0) / prevTasks.length
    : 0;
  
  const trends = {
    successRateChange: successRate - prevSuccessRate,
    durationChange: avgDuration - prevAvgDuration,
    taskVolumeChange: totalTasks - prevTasks.length
  };
  
  return {
    timeframe,
    summary: {
      totalTasks,
      successRate,
      avgDuration: avgDuration / 1000, // Convert to seconds
      agentsSpawned: Object.values(agentMetrics).reduce((sum, m) => sum + m.total, 0),
      memoryEfficiency: systemMetrics.memoryEfficiency,
      neuralEvents: metricsCache.performance.neuralEvents
    },
    agentMetrics,
    systemMetrics,
    trends,
    tasks: recentTasks.slice(-20) // Last 20 tasks
  };
}
