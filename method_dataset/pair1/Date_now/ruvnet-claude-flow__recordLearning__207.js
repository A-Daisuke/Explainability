class __C__ {
  async recordLearning(agentId, learning) {
    const learningData = {
      agentId,
      timestamp: Date.now(),
      type: learning.type,
      input: learning.input,
      output: learning.output,
      feedback: learning.feedback,
      improvement: learning.improvement,
    };

    return this.store(`learning:${agentId}:${Date.now()}`, learningData, {
      namespace: 'learning',
      ttl: 604800, // 7 days
    });
  }

}
