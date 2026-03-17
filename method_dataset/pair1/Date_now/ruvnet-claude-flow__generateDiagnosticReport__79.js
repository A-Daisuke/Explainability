function __method_wrapper__() {
  async generateDiagnosticReport(config: DiagnosticConfig = {}): Promise<DiagnosticReport> {
    this.logger.info('Generating comprehensive diagnostic report');

    const startTime = Date.now();

    try {
      // Get system health
      const systemHealth = await this.systemIntegration.getSystemHealth();

      // Get current metrics
      const metrics = this.healthCheckManager.getCurrentMetrics();

      // Analyze components
      const components = await this.analyzeComponents(config);

      // Analyze performance
      const performance = await this.analyzePerformance(config);

      // Generate recommendations
      const recommendations =
        config.generateRecommendations !== false
          ? this.generateRecommendations(systemHealth, performance, components)
          : [];

      // Determine overall severity
      const severity = this.calculateSeverity(systemHealth, components);

      const report: DiagnosticReport = {
        timestamp: Date.now(),
        systemHealth,
        metrics,
        components,
        performance,
        recommendations,
        severity,
      };

      // Export report if requested
      if (config.outputPath) {
        await this.exportReport(report, config);
      }

      const duration = Date.now() - startTime;
      this.logger.info(`Diagnostic report generated in ${duration}ms`);

      this.eventBus.emit('diagnostics:report:generated', {
        report,
        duration,
        timestamp: Date.now(),
      });

      return report;
    } catch (error) {
      this.logger.error('Failed to generate diagnostic report:', getErrorMessage(error));
      throw error;
    }
  }

}
