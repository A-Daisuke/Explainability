function __method_wrapper__() {
  private async showProcessMenu(process: ProcessInfo): Promise<void> {
    console.log();
    console.log(chalk.cyan.bold(`Selected: ${process.name}`));
    console.log(chalk.gray('─'.repeat(40)));

    if (process.status === ProcessStatus.STOPPED) {
      console.log('[s] Start');
    } else if (process.status === ProcessStatus.RUNNING) {
      console.log('[x] Stop');
      console.log('[r] Restart');
    }

    console.log('[d] Details');
    console.log('[c] Cancel');

    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    await Deno.stdout.write(encoder.encode('\nAction: '));

    const buf = new Uint8Array(1024);
    const n = await Deno.stdin.read(buf);
    if (n === null) return;

    const action = decoder.decode(buf.subarray(0, n)).trim().toLowerCase();

    switch (action) {
      case 's':
        if (process.status === ProcessStatus.STOPPED) {
          await this.startProcess(process.id);
        }
        break;
      case 'x':
        if (process.status === ProcessStatus.RUNNING) {
          await this.stopProcess(process.id);
        }
        break;
      case 'r':
        if (process.status === ProcessStatus.RUNNING) {
          await this.restartProcess(process.id);
        }
        break;
      case 'd':
        this.showProcessDetails(process);
        await this.waitForKey();
        break;
    }

    this.render();
  }

}
