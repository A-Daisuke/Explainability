async function getSystemStatus(): Promise<any> {
  const reader = new MetricsReader();
  
  // Get real metrics from files
  const [systemMetrics, perfMetrics, agents, recentTasks, overallHealth] = await Promise.all([
    reader.getSystemMetrics(),
    reader.getPerformanceMetrics(),
    reader.getActiveAgents(),
    reader.getRecentTasks(5),
    reader.getOverallHealth()
  ]);
  
  // Calculate uptime and memory in MB
  const uptime = systemMetrics ? systemMetrics.uptime * 1000 : 0; // Convert to ms
  const memUsedMB = systemMetrics ? Math.round(systemMetrics.memoryUsed / (1024 * 1024)) : 0;
  const memTotalMB = systemMetrics ? Math.round(systemMetrics.memoryTotal / (1024 * 1024)) : 512;
  
  // Determine component health based on metrics
  const orchestratorStatus = perfMetrics && perfMetrics.totalTasks > 0 ? 'healthy' : 'idle';
  const agentsStatus = agents.length > 0 ? 'healthy' : 'idle';
  const memoryStatus = systemMetrics && systemMetrics.memoryUsagePercent < 80 ? 'healthy' : 
                       systemMetrics && systemMetrics.memoryUsagePercent < 90 ? 'warning' : 'error';
  
  // Count active agents
  const activeAgentCount = agents.filter(a => a.status === 'active' || a.status === 'busy').length;
  
  return {
    overall: overallHealth,
    version: VERSION,
    uptime: uptime,
    startTime: Date.now() - uptime,
    components: {
      orchestrator: {
        status: orchestratorStatus,
        uptime: uptime,
        details: perfMetrics ? `${perfMetrics.totalTasks} tasks processed` : 'No tasks yet',
      },
      agents: {
        status: agentsStatus,
        uptime: uptime,
        details: `${activeAgentCount} active, ${agents.length} total agents`,
      },
      memory: {
        status: memoryStatus,
        uptime: uptime,
        details: `Using ${memUsedMB}MB of ${memTotalMB}MB`,
      },
    },
    resources: {
      memory: {
        used: memUsedMB,
        total: memTotalMB,
      },
      cpu: {
        used: systemMetrics ? Math.round(systemMetrics.cpuLoad * 100) : 0,
        total: 100,
      },
    },
    agents: agents,
    recentTasks: recentTasks,
  };
}
