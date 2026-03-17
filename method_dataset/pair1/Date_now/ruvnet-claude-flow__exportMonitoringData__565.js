function __method_wrapper__() {
  private async exportMonitoringData(): Promise<void> {
    try {
      const exportData = {
        metadata: {
          exportTime: new Date().toISOString(),
          duration: formatDuration(Date.now() - this.startTime),
          dataPoints: this.exportData.length,
          interval: this.options.interval,
        },
        data: this.exportData,
        alerts: this.alerts,
      };

      await fs.writeFile(this.options.export, JSON.stringify(exportData, null, 2));
      console.log(chalk.green(`✓ Monitoring data exported to ${this.options.export}`));
    } catch (error) {
      console.error(chalk.red('Failed to export data:'), (error as Error).message);
    }
  }

}
