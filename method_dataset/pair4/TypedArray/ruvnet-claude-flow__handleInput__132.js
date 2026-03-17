class __C__ {
  async handleInput() {
    // Simple input reading
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    await Deno.stdout.write(encoder.encode('\nCommand: '));

    const buf = new Uint8Array(1024);
    const n = await Deno.stdin.read(buf);
    if (n === null) return;

    const rawInput = decoder.decode(buf.subarray(0, n)).trim();
    // Take only the first line if multiple lines were read
    const input = rawInput.split('\n')[0].toLowerCase();

    // Handle commands
    switch (input) {
      case 'q':
      case 'quit':
        this.running = false;
        console.clear();
        printSuccess('Goodbye!');
        process.exit(0); // Exit immediately
        break;

      case 'a':
        await this.startAll();
        break;

      case 'z':
        await this.stopAll();
        break;

      case 'r':
        await this.restartAll();
        break;

      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        const index = parseInt(input) - 1;
        if (index >= 0 && index < PROCESSES.length) {
          this.selectedIndex = index;
          await this.toggleSelected();
        }
        break;

      case ' ':
      case 'enter':
      case '':
        await this.toggleSelected();
        break;

      default:
        if (input) {
          console.log(colors.yellow(`Unknown command: ${input}`));
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
  }

}
