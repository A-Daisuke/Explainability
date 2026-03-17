function __method_wrapper__() {
  private async generateSystemLoadChart(systemMetrics: SystemTruthMetrics): Promise<SystemLoadChart[]> {
    // Generate synthetic load data (would typically come from time-series DB)
    const dataPoints: SystemLoadChart[] = [];
    const now = Date.now();
    const hourMs = 60 * 60 * 1000;
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now - (i * hourMs));
      
      // Simulate load variation
      const baseLoad = systemMetrics.totalTasks / 24; // Average per hour
      const variation = (Math.random() - 0.5) * 0.3; // ±30% variation
      const load = Math.max(0, baseLoad * (1 + variation));
      
      const capacity = systemMetrics.agentCount * 10; // 10 tasks per agent per hour
      const utilization = capacity > 0 ? Math.min(1, load / capacity) : 0;
      
      dataPoints.push({
        timestamp,
        load,
        capacity,
        utilization,
      });
    }
    
    return dataPoints;
  }

}
