async function getSystemStatus(verbose = false) {
  const reader = new MetricsReader();
  
  // Get real metrics from files
  const [systemMetrics, perfMetrics, agents, recentTasks, overallHealth, mcpStatus, taskQueue] = await Promise.all([
    reader.getSystemMetrics(),
    reader.getPerformanceMetrics(),
    reader.getActiveAgents(),
    reader.getRecentTasks(5),
    reader.getOverallHealth(),
    reader.getMCPServerStatus(),
    reader.getTaskQueue()
  ]);
  
  // Count active agents
  const activeAgentCount = agents.filter(a => a.status === 'active' || a.status === 'busy').length;
  
  // Build status object with real data
  const status = {
    timestamp: Date.now(),
    version: '2.0.0-alpha.83',
    orchestrator: {
      running: perfMetrics && perfMetrics.totalTasks > 0,
      uptime: systemMetrics ? systemMetrics.uptime : 0,
      status: perfMetrics && perfMetrics.totalTasks > 0 ? 'Running' : 'Not Running',
    },
    agents: {
      active: activeAgentCount,
      total: agents.length,
      types: agents.reduce((acc, agent) => {
        acc[agent.type] = (acc[agent.type] || 0) + 1;
        return acc;
      }, {}),
    },
    tasks: {
      queued: taskQueue.filter(t => t.status === 'queued').length,
      running: taskQueue.filter(t => t.status === 'running').length + agents.filter(a => a.status === 'busy').length,
      completed: perfMetrics ? perfMetrics.successfulTasks : 0,
      failed: perfMetrics ? perfMetrics.failedTasks : 0,
    },
    memory: {
      status: systemMetrics && systemMetrics.memoryUsagePercent < 80 ? 'Ready' : 'Warning',
      entries: await getMemoryStats(),
      size: systemMetrics ? `${(systemMetrics.memoryUsed / (1024 * 1024)).toFixed(2)} MB` : '0 KB',
    },
    terminal: {
      status: 'Ready',
      poolSize: 10,
      active: perfMetrics ? perfMetrics.activeAgents : 0,
    },
    mcp: {
      status: mcpStatus && mcpStatus.running ? 'Running' : 'Stopped',
      port: mcpStatus ? mcpStatus.port : null,
      connections: mcpStatus ? mcpStatus.connections : 0,
    },
    resources: verbose ? await getResourceUsage() : null,
  };

  return status;
}
