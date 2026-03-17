function __method_wrapper__() {
  private async showProcessDetails(process: UIProcess): Promise<void> {
    console.log();
    console.log(chalk.cyan.bold(`📋 Process Details: ${process.name}`));
    console.log(chalk.gray('─'.repeat(60)));

    console.log(chalk.white('ID:'), process.id);
    console.log(chalk.white('Type:'), process.type);
    console.log(chalk.white('Status:'), this.getStatusDisplay(process.status), process.status);

    if (process.pid) {
      console.log(chalk.white('PID:'), process.pid);
    }

    if (process.startTime) {
      const uptime = Date.now() - process.startTime;
      console.log(chalk.white('Uptime:'), this.formatUptime(uptime));
    }

    if (process.metrics) {
      console.log();
      console.log(chalk.white.bold('Metrics:'));
      if (process.metrics.cpu !== undefined) {
        console.log(chalk.white('CPU:'), `${process.metrics.cpu.toFixed(1)}%`);
      }
      if (process.metrics.memory !== undefined) {
        console.log(chalk.white('Memory:'), `${process.metrics.memory.toFixed(0)} MB`);
      }
      if (process.metrics.restarts !== undefined) {
        console.log(chalk.white('Restarts:'), process.metrics.restarts);
      }
      if (process.metrics.lastError) {
        console.log(chalk.red('Last Error:'), process.metrics.lastError);
      }
    }
  }

}
