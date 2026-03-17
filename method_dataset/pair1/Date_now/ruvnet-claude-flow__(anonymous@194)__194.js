function __method_wrapper__() {
    this.processes.forEach((process, index) => {
      console.log(
        `${chalk.gray(`[${index + 1}]`)} ${this.getStatusDisplay(process.status)} ${chalk.white.bold(process.name)}`,
      );
      console.log(chalk.gray(`    Type: ${process.type}`));

      if (process.pid) {
        console.log(chalk.gray(`    PID: ${process.pid}`));
      }

      if (process.startTime) {
        const uptime = Date.now() - process.startTime;
        console.log(chalk.gray(`    Uptime: ${this.formatUptime(uptime)}`));
      }

      if (process.metrics) {
        if (process.metrics.cpu !== undefined) {
          console.log(chalk.gray(`    CPU: ${process.metrics.cpu.toFixed(1)}%`));
        }
        if (process.metrics.memory !== undefined) {
          console.log(chalk.gray(`    Memory: ${process.metrics.memory.toFixed(0)} MB`));
        }
      }

      console.log();
    });

}
