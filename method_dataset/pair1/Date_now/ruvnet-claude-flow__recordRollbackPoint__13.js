function __method_wrapper__() {
  async recordRollbackPoint(type, data) {
    const result = {
      success: true,
      errors: [],
    };

    try {
      const state = await this.loadState();

      const rollbackPoint = {
        id: this.generateId(),
        type,
        timestamp: Date.now(),
        data,
        ...data,
      };

      state.rollbackPoints = state.rollbackPoints || [];
      state.rollbackPoints.push(rollbackPoint);

      // Keep only the last 10 rollback points
      if (state.rollbackPoints.length > 10) {
        state.rollbackPoints = state.rollbackPoints.slice(-10);
      }

      await this.saveState(state);
    } catch (error) {
      result.success = false;
      result.errors.push(`Failed to record rollback point: ${error.message}`);
    }

    return result;
  }

}
