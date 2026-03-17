class __C__ {
  async handleInput() {
    const terminal = compat.terminal;

    await terminal.write('\nCommand: ');

    const buf = new Uint8Array(1024);
    const n = await terminal.read(buf);
    if (n === null) return;

    const rawInput = terminal.decoder.decode(buf.subarray(0, n)).trim();
    const input = rawInput.split('\n')[0].toLowerCase();

    // Global commands
    switch (input) {
      case 'q':
      case 'quit':
        this.running = false;
        console.clear();
        printSuccess('Goodbye!');
        compat.terminal.exit(0);
        break;

      case '1':
        this.currentView = VIEWS.PROCESSES;
        this.selectedIndex = 0;
        break;

      case '2':
        this.currentView = VIEWS.STATUS;
        this.selectedIndex = 0;
        break;

      case '3':
        this.currentView = VIEWS.ORCHESTRATION;
        this.selectedIndex = 0;
        break;

      case '4':
        this.currentView = VIEWS.MEMORY;
        this.selectedIndex = 0;
        break;

      case '5':
        this.currentView = VIEWS.LOGS;
        this.selectedIndex = 0;
        break;

      case '6':
      case '?':
      case 'h':
      case 'help':
        this.currentView = VIEWS.HELP;
        break;

      case 'tab':
      case '\t':
        // Cycle through views
        const viewKeys = Object.values(VIEWS);
        const currentIndex = viewKeys.indexOf(this.currentView);
        this.currentView = viewKeys[(currentIndex + 1) % viewKeys.length];
        this.selectedIndex = 0;
        break;

      default:
        // View-specific commands
        await this.handleViewSpecificInput(input);
    }

    // Update system stats
    this.updateSystemStats();
  }

}
