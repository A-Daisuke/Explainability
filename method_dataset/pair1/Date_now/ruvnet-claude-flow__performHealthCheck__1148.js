function __method_wrapper__() {
  private performHealthCheck(): void {
    const now = Date.now();
    
    for (const agent of this.agents.values()) {
      // Check for stalled agents
      const inactiveTime = now - agent.lastActivity.getTime();
      
      if (agent.status === 'busy' && inactiveTime > this.config.timeout * 2) {
        this.logger.warn('Agent appears stalled', {
          agentId: agent.id,
          inactiveTime,
          currentTask: agent.currentTask,
        });

        // Try to recover the agent
        this.recoverStalledAgent(agent);
      }

      // Check for failed processes
      if (agent.process.killed || agent.process.exitCode !== null) {
        if (agent.status !== 'terminated') {
          this.logger.warn('Agent process died unexpectedly', {
            agentId: agent.id,
            exitCode: agent.process.exitCode,
          });
          
          agent.status = 'error';
          this.moveAgentToFailedPool(agent);
        }
      }
    }
  }

}
