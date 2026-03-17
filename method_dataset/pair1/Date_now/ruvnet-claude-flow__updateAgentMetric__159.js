function __method_wrapper__() {
  async updateAgentMetric(metric: TruthMetric): Promise<void> {
    const agentId = metric.agentId;
    
    // Get or create agent data
    let agentData = this.agentData.get(agentId);
    if (!agentData) {
      agentData = {
        agentId,
        metrics: [],
        recentMetrics: [],
        taskHistory: [],
        errorHistory: [],
      };
      this.agentData.set(agentId, agentData);
    }
    
    // Add metric to agent data
    agentData.metrics.push(metric);
    
    // Update recent metrics (last 15 minutes)
    const recentCutoff = new Date(Date.now() - this.config.windowSizes.recent * 60 * 1000);
    agentData.recentMetrics = agentData.metrics.filter(m => m.timestamp >= recentCutoff);
    
    // Update task history
    await this.updateTaskHistory(agentData, metric);
    
    // Update error history
    await this.updateErrorHistory(agentData, metric);
    
    // Trigger score recalculation for significant updates
    if (this.shouldRecalculateScore(metric)) {
      await this.calculateAgentScore(agentId);
    }
  }

}
