function __method_wrapper__() {
  private async handleExit(): Promise<void> {
    const processes = this.processManager.getAllProcesses();
    const hasRunning = processes.some((p) => p.status === ProcessStatus.RUNNING);

    if (hasRunning) {
      console.log();
      console.log(chalk.yellow('⚠️  Some processes are still running.'));
      console.log('Stop all processes before exiting? [y/N]: ');

      const decoder = new TextDecoder();
      const buf = new Uint8Array(1024);
      const n = await Deno.stdin.read(buf);

      if (n && decoder.decode(buf.subarray(0, n)).trim().toLowerCase() === 'y') {
        await this.stopAll();
      }
    }

    await this.stop();
  }

}
