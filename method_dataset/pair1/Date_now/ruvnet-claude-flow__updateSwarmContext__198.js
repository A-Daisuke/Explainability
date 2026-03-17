class __C__ {
  async updateSwarmContext() {
    try {
      const contextUpdate = {
        phase: this.phaseName,
        timestamp: Date.now(),
        artifacts: this.artifacts,
        memory: this.memory,
        status: 'completed',
      };

      await this.storeInSwarmMemory(
        `${this.options.namespace}_swarm_context`,
        JSON.stringify(contextUpdate),
      );
      console.log(`🐝 Updated swarm context for ${this.phaseName}`);
    } catch (error) {
      console.warn(`⚠️ Failed to update swarm context: ${error.message}`);
    }
  }

}
