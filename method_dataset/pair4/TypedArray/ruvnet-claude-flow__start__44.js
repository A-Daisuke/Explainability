function __method_wrapper__() {
  async start(): Promise<void> {
    this.running = true;

    // Clear screen
    console.clear();

    // Initial render
    this.render();

    // Simple input loop
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    while (this.running) {
      // Show prompt
      await Deno.stdout.write(encoder.encode('\nCommand: '));

      // Read single character
      const buf = new Uint8Array(1024);
      const n = await Deno.stdin.read(buf);
      if (n === null) break;

      const input = decoder.decode(buf.subarray(0, n)).trim();

      if (input.length > 0) {
        await this.handleCommand(input);
      }
    }
  }

}
