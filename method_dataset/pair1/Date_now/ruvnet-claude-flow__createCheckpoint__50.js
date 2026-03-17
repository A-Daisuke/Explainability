function __method_wrapper__() {
  async createCheckpoint(phase, data) {
    const result = {
      success: true,
      id: null,
      errors: [],
    };

    try {
      const state = await this.loadState();

      const checkpoint = {
        id: this.generateId(),
        phase,
        timestamp: Date.now(),
        data,
        status: 'active',
      };

      result.id = checkpoint.id;

      state.checkpoints = state.checkpoints || [];
      state.checkpoints.push(checkpoint);

      // Keep only the last 20 checkpoints
      if (state.checkpoints.length > 20) {
        state.checkpoints = state.checkpoints.slice(-20);
      }

      await this.saveState(state);
    } catch (error) {
      result.success = false;
      result.errors.push(`Failed to create checkpoint: ${error.message}`);
    }

    return result;
  }

}
