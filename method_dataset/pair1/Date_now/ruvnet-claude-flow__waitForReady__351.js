function __method_wrapper__() {
  private async waitForReady(): Promise<void> {
    // Send a test command to ensure shell is ready
    const testCommand = this.shell === 'powershell' ? 'Write-Host "READY"' : 'echo "READY"';

    await this.write(testCommand + '\n');

    const startTime = Date.now();
    while (Date.now() - startTime < 5000) {
      if (this.outputBuffer.includes('READY')) {
        this.outputBuffer = '';
        return;
      }
      await delay(100);
    }

    throw new TerminalError('Terminal failed to become ready');
  }

}
