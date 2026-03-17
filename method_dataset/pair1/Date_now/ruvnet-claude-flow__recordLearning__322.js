class __C__ {
  async recordLearning(learningData) {
    if (!this.options.neuralLearning) return;

    try {
      const learningRecord = {
        phase: this.phaseName,
        timestamp: Date.now(),
        data: learningData,
        context: {
          task: this.taskDescription,
          options: this.options,
          metrics: this.getMetrics(),
        },
      };

      await this.storeInMemory(`learning_${Date.now()}`, learningRecord);

      // Store in neural learning system if available
      if (this.options.swarmEnabled) {
        await this.storeInSwarmMemory(
          `neural_learning_${this.phaseName}`,
          JSON.stringify(learningRecord),
        );
      }

      console.log(`🧠 Recorded learning for ${this.phaseName}`);
    } catch (error) {
      console.warn(`⚠️ Failed to record learning: ${error.message}`);
    }
  }

}
