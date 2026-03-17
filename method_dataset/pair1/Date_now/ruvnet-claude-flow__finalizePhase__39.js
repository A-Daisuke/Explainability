function __method_wrapper__() {
  async finalizePhase() {
    this.endTime = Date.now();
    const duration = this.endTime - this.startTime;

    console.log(`✅ ${this.phaseName} phase completed in ${duration}ms`);

    // Store phase completion in memory
    await this.storeInMemory(`${this.phaseName}_completed`, {
      timestamp: this.endTime,
      duration: duration,
      artifacts: this.artifacts,
    });

    // Update swarm context if enabled
    if (this.options.swarmEnabled) {
      await this.updateSwarmContext();
    }
  }

}
