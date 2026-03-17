class __C__ {
  setupEventHandlers() {
    this.startTime = Date.now();
    
    // Handle process signals
    process.on('SIGINT', () => {
      console.log('Received SIGINT, shutting down truth monitoring server...');
      this.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('Received SIGTERM, shutting down truth monitoring server...');
      this.stop();
      process.exit(0);
    });
  }

}
