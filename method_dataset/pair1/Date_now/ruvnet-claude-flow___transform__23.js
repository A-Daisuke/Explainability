function __method_wrapper__() {
  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim()) {
        try {
          const event = JSON.parse(line);
          this.processEvent(event);
        } catch (e) {
          // Not JSON, pass through if in verbose mode
          if (this.options.verbose) {
            console.log(`[${this.agentName}] ${line}`);
          }
        }
      }
    }

    // Update progress display periodically
    if (Date.now() - this.lastUpdate > 1000) {
      this.updateProgress();
      this.lastUpdate = Date.now();
    }

    callback();
  }

}
