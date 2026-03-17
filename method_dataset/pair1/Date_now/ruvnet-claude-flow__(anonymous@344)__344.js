function __method_wrapper__() {
  systemMonitoringInterval = setInterval(async () => {
    const metrics = await getSystemMetrics();
    
    // Store system metrics
    if (!metricsCache.system) {
      metricsCache.system = [];
    }
    
    metricsCache.system.push({
      timestamp: Date.now(),
      ...metrics
    });
    
    // Keep only last 24 hours of system metrics
    const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
    metricsCache.system = metricsCache.system.filter(m => m.timestamp > dayAgo);
    
    // Save to disk
    try {
      await fs.writeFile(SYSTEM_METRICS_FILE, JSON.stringify(metricsCache.system, null, 2));
    } catch (err) {
      // Ignore save errors
    }
  }, 30000);

}
