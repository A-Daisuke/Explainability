async function collectMetrics() {
  const timestamp = Date.now();

  // Collect real system metrics
  const cpuUsage = await getCPUUsage();
  const memoryInfo = getMemoryInfo();
  const diskUsage = await getDiskUsage();
  const systemUptime = os.uptime();

  // Try to get orchestrator metrics from file or socket
  const orchestratorMetrics = await getOrchestratorMetrics();

  // Collect performance metrics
  const performanceMetrics = getPerformanceMetrics();

  // Collect resource utilization
  const resourceMetrics = await getResourceMetrics();

  return {
    timestamp,
    system: {
      uptime: systemUptime,
      cpu_usage: cpuUsage,
      memory_usage: memoryInfo.usedMB,
      memory_total: memoryInfo.totalMB,
      memory_percentage: memoryInfo.percentage,
      disk_usage: diskUsage.percentage,
      disk_used: diskUsage.usedGB,
      disk_total: diskUsage.totalGB,
      load_average: os.loadavg(),
      cpu_count: os.cpus().length,
      platform: os.platform(),
      node_version: process.version,
    },
    orchestrator: orchestratorMetrics,
    performance: performanceMetrics,
    resources: resourceMetrics,
  };
}
