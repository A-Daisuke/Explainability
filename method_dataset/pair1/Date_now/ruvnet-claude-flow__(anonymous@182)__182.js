function __method_wrapper__() {
  return new Promise((resolve, reject) => {
    const writeEmulator = terminalWriteEmulators.get(terminal);
    if (!writeEmulator) {
      reject(new Error('No write emulator for terminal'));
      return;
    }

    let output = '';
    const marker = `__COMMAND_COMPLETE_${Date.now()}__`;

    // Set up output listener
    const disposable = writeEmulator.event((data: string) => {
      output += data;

      if (output.includes(marker)) {
        // Command completed
        disposable.dispose();
        const result = output.substring(0, output.indexOf(marker));
        resolve(result);
      }
    });

    // Set timeout
    const timer = setTimeout(() => {
      disposable.dispose();
      reject(new Error('Command timeout'));
    }, timeout);

    // Execute command with marker
    terminal.sendText(`${command} && echo "${marker}"`);

    // Clear timeout on success
    writeEmulator.event(() => {
      if (output.includes(marker)) {
        clearTimeout(timer);
      }
    });
  });

}
