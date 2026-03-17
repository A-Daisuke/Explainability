function __method_wrapper__() {
  async executeTool(toolName, params = {}) {
    const startTime = Date.now();
    let lastError = null;

    for (let attempt = 1; attempt <= this.config.retryCount; attempt++) {
      try {
        const result = await this._executeToolInternal(toolName, params);

        // Track statistics
        this._trackToolUsage(toolName, Date.now() - startTime, true);

        return result;
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed for ${toolName}:`, error.message);

        if (attempt < this.config.retryCount) {
          // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    // Track failure
    this._trackToolUsage(toolName, Date.now() - startTime, false);

    throw new Error(
      `Failed to execute ${toolName} after ${this.config.retryCount} attempts: ${lastError.message}`,
    );
  }

}
