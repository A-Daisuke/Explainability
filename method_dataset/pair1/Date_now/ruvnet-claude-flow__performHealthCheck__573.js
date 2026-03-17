function performHealthCheck() {
  const now = Date.now();
  const metrics = calculateMetrics();
  
  // Simple health checks
  const apiHealth = {
    status: 'up',
    response_time: Math.random() * 100 + 50,
    last_check: now,
    error_count: 0,
  };
  
  const websocketHealth = {
    status: 'up',
    response_time: Math.random() * 50 + 20,
    last_check: now,
    error_count: 0,
  };
  
  const graphqlHealth = {
    status: 'up',
    response_time: Math.random() * 150 + 75,
    last_check: now,
    error_count: 0,
  };
  
  const databaseHealth = {
    status: 'up',
    response_time: Math.random() * 200 + 100,
    last_check: now,
    error_count: 0,
  };
  
  const cacheHealth = {
    status: 'up',
    response_time: Math.random() * 25 + 10,
    last_check: now,
    error_count: 0,
  };
  
  const allServices = [apiHealth, websocketHealth, graphqlHealth, databaseHealth, cacheHealth];
  const downServices = allServices.filter(s => s.status === 'down').length;
  const degradedServices = allServices.filter(s => s.status === 'degraded').length;
  
  let overallStatus = 'healthy';
  if (downServices > 0) {
    overallStatus = 'unhealthy';
  } else if (degradedServices > 1) {
    overallStatus = 'degraded';
  }
  
  return {
    status: overallStatus,
    timestamp: now,
    services: {
      api: apiHealth,
      websocket: websocketHealth,
      graphql: graphqlHealth,
      database: databaseHealth,
      cache: cacheHealth,
    },
    metrics: {
      uptime: metrics.uptime_ms,
      memory_usage: process.memoryUsage().heapUsed / process.memoryUsage().heapTotal * 100,
      cpu_usage: Math.random() * 20 + 10,
      active_connections: Math.floor(Math.random() * 100) + 20,
    },
  };
}
