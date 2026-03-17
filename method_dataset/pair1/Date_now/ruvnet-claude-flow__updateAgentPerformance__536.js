function __method_wrapper__() {
  async updateAgentPerformance(phaseName, result, validation) {
    const phaseAgents = this.phaseAgents.get(phaseName) || [];

    for (const agent of phaseAgents) {
      agent.performance.tasksCompleted += 1;

      // Update quality score based on validation
      const qualityScore = validation.score / 100;
      agent.performance.qualityScore = (agent.performance.qualityScore + qualityScore) / 2;

      // Update efficiency based on execution time
      const executionTime = Date.now() - this.getPhaseStartTime(phaseName);
      const expectedTime = this.getExpectedPhaseTime(phaseName);
      const efficiency = Math.min(1, expectedTime / executionTime);
      agent.performance.efficiency = (agent.performance.efficiency + efficiency) / 2;

      // Update average time
      agent.performance.averageTime = (agent.performance.averageTime + executionTime) / 2;

      // Store performance update
      await this.executeSwarmHook('update_agent_performance', {
        agentId: agent.id,
        performance: agent.performance,
        phase: phaseName,
      });
    }
  }

}
