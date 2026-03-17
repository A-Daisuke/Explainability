function __method_wrapper__() {
  async cleanupOldState(daysToKeep = 7) {
    const result = {
      success: true,
      cleaned: 0,
      errors: [],
    };

    try {
      const state = await this.loadState();
      const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;

      let cleaned = 0;

      // Clean rollback points
      if (state.rollbackPoints) {
        const before = state.rollbackPoints.length;
        state.rollbackPoints = state.rollbackPoints.filter((rp) => rp.timestamp > cutoffTime);
        cleaned += before - state.rollbackPoints.length;
      }

      // Clean checkpoints
      if (state.checkpoints) {
        const before = state.checkpoints.length;
        state.checkpoints = state.checkpoints.filter((cp) => cp.timestamp > cutoffTime);
        cleaned += before - state.checkpoints.length;
      }

      // Clean file operations
      if (state.fileOperations) {
        const before = state.fileOperations.length;
        state.fileOperations = state.fileOperations.filter((fo) => fo.timestamp > cutoffTime);
        cleaned += before - state.fileOperations.length;
      }

      result.cleaned = cleaned;

      if (cleaned > 0) {
        await this.saveState(state);
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`State cleanup failed: ${error.message}`);
    }

    return result;
  }

}
