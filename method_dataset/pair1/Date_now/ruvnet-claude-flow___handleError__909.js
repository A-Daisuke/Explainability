class __C__ {
  _handleError(error) {
    // Log error to memory
    this.mcpWrapper
      .storeMemory(
        this.state.swarmId,
        `error-${Date.now()}`,
        {
          message: error.message,
          stack: error.stack,
          timestamp: Date.now(),
        },
        'error',
      )
      .catch(console.error);
  }

}
