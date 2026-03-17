function __method_wrapper__() {
  (vscode.window as any).createTerminal = function (options: vscode.TerminalOptions) {
    const terminal = originalCreateTerminal.call(vscode.window, options) as vscode.Terminal;

    // Create write emulator for this terminal
    const writeEmulator = new vscode.EventEmitter<string>();
    terminalWriteEmulators.set(terminal, writeEmulator);

    // Find terminal ID from name
    const match = options.name?.match(/Claude-Flow Terminal ([\w-]+)/);
    if (match) {
      const terminalId = match[1];
      activeTerminals.set(terminalId, terminal);

      // Set up output capture
      captureTerminalOutput(terminal, terminalId);
    }

    return terminal;
  };

}
