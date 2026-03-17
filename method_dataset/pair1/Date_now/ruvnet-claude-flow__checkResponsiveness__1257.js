function __method_wrapper__() {
  private async checkResponsiveness(agentId: string): Promise<number> {
    // Send ping and measure response time

    try {
      // This would send an actual ping to the agent
      // For now, simulate based on last heartbeat
      const agent = this.agents.get(agentId);
      if (!agent) return 0;
      const timeSinceHeartbeat = Date.now() - agent.lastHeartbeat.getTime();

      if (timeSinceHeartbeat > this.config.heartbeatInterval * 3) {
        return 0; // Unresponsive
      } else if (timeSinceHeartbeat > this.config.heartbeatInterval * 2) {
        return 0.5; // Slow
      } else {
        return 1.0; // Responsive
      }
    } catch (error) {
      return 0; // Failed to respond
    }
  }

}
