function __method_wrapper__() {
  private checkHeartbeats(): void {
    const now = Date.now();
    const timeout = this.config.heartbeatInterval * 3;

    for (const [agentId, agent] of Array.from(this.agents.entries())) {
      const timeSinceHeartbeat = now - agent.lastHeartbeat.getTime();

      if (
        timeSinceHeartbeat > timeout &&
        agent.status !== 'offline' &&
        agent.status !== 'terminated'
      ) {
        this.logger.warn('Agent heartbeat timeout', { agentId, timeSinceHeartbeat });

        agent.status = 'error';
        this.addAgentError(agentId, {
          timestamp: new Date(),
          type: 'heartbeat_timeout',
          message: 'Agent failed to send heartbeat within timeout period',
          context: { timeout, timeSinceHeartbeat },
          severity: 'high',
          resolved: false,
        });

        this.emit('agent:heartbeat-timeout', { agentId, timeSinceHeartbeat });

        // Auto-restart if enabled
        if (this.config.autoRestart) {
          this.restartAgent(agentId, 'heartbeat_timeout').catch((error) => {
            this.logger.error('Failed to auto-restart agent', { agentId, error });
          });
        }
      }
    }
  }

}
