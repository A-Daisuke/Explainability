function __method_wrapper__() {
  async loadState() {
    try {
      const content = await fs.readFile(this.stateFile, 'utf8');
      return JSON.parse(content);
    } catch {
      // Return default state if file doesn't exist or is invalid
      return {
        version: '1.0',
        created: Date.now(),
        lastActivity: Date.now(),
        rollbackPoints: [],
        checkpoints: [],
        rollbackHistory: [],
        fileOperations: [],
        currentPhase: 'not-started',
        phaseHistory: [],
      };
    }
  }

}
