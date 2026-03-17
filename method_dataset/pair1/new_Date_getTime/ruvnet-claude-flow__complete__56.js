function __method_wrapper__() {
  complete(message: string): void {
    this.stopSpinner();

    const duration = new Date().getTime() - this.startTime.getTime();
    const seconds = (duration / 1000).toFixed(2);

    console.log(chalk.green(`\n✅ ${message}`));
    console.log(chalk.gray(`   Completed in ${seconds}s`));

    if (this.progress.warnings > 0) {
      console.log(chalk.yellow(`   ${this.progress.warnings} warnings`));
    }

    if (this.progress.errors > 0) {
      console.log(chalk.red(`   ${this.progress.errors} errors`));
    }
  }

}
