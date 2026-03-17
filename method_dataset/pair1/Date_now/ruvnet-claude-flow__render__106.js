class __C__ {
  render() {
    const now = Date.now();
    this.spinnerIndex = (this.spinnerIndex + 1) % this.spinnerFrames.length;
    const spinner = this.spinnerFrames[this.spinnerIndex];
    
    // Clear screen completely and move cursor to home position
    process.stdout.write('\x1B[2J\x1B[H');
    
    // Header
    this.renderHeader();
    
    // Agent panels
    this.renderAgentPanels(spinner);
    
    // Summary footer
    this.renderFooter();
    
    this.lastRender = now;
  }

}
