function __method_wrapper__() {
  getSystemStatistics(): {
    totalMetricsProcessed: number;
    systemUptime: number;
    averageProcessingRate: number;
    healthScore: number;
    lastAnalysis: Date;
  } {
    const uptime = Date.now() - this.systemStartTime.getTime();
    const processingRate = uptime > 0 ? (this.totalMetricsProcessed / (uptime / 1000)) : 0;
    
    return {
      totalMetricsProcessed: this.totalMetricsProcessed,
      systemUptime: uptime,
      averageProcessingRate: processingRate,
      healthScore: this.healthIndicators.overallHealth,
      lastAnalysis: this.lastAnalysisTime,
    };
  }

}
