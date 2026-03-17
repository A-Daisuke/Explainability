function __method_wrapper__() {
  generateSummary() {
    const summary = {
      taskDescription: this.taskDescription,
      executionTime: Date.now() - this.startTime,
      phases: this.phaseOrder.map((phase) => ({
        name: phase,
        status: this.qualityGates[phase]?.passed ? 'passed' : 'failed',
        artifacts: this.artifacts[phase],
      })),
      qualityGates: this.qualityGates,
      artifacts: this.artifacts,
      recommendations: this.generateRecommendations(),
    };

    return summary;
  }

}
