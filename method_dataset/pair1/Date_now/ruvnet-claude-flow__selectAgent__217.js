function __method_wrapper__() {
  async selectAgent(
    task: TaskDefinition,
    availableAgents: AgentState[],
    constraints?: {
      excludeAgents?: AgentId[];
      preferredAgents?: AgentId[];
      maxLoad?: number;
      requireCapabilities?: string[];
    },
  ): Promise<LoadBalancingDecision> {
    const startTime = Date.now();

    try {
      // Filter agents based on constraints
      let candidates = this.filterAgentsByConstraints(availableAgents, task, constraints);

      if (candidates.length === 0) {
        throw new Error('No suitable agents available for task');
      }

      // Apply selection strategy
      const decision = await this.applySelectionStrategy(task, candidates);

      // Record decision
      this.decisions.push(decision);

      // Keep only last 1000 decisions
      if (this.decisions.length > 1000) {
        this.decisions.shift();
      }

      const selectionTime = Date.now() - startTime;
      this.logger.debug('Agent selected', {
        taskId: task.id.id,
        selectedAgent: decision.selectedAgent.id,
        reason: decision.reason,
        confidence: decision.confidence,
        selectionTime,
      });

      this.emit('agent:selected', { task, decision, selectionTime });

      return decision;
    } catch (error) {
      this.logger.error('Agent selection failed', { taskId: task.id.id, error });
      throw error;
    }
  }

}
