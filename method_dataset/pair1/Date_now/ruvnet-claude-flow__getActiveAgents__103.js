function __method_wrapper__() {
  async getActiveAgents(): Promise<Agent[]> {
    try {
      // First check performance metrics for agent count
      const perfMetrics = await this.getPerformanceMetrics();
      
      // Also check session files for more detailed agent info
      const sessionFiles = await this.getSessionFiles();
      const agents: Agent[] = [];
      
      for (const file of sessionFiles) {
        try {
          const content = await fs.readFile(path.join(this.sessionsDir, 'pair', file), 'utf8');
          const sessionData = JSON.parse(content);
          
          if (sessionData.agents && Array.isArray(sessionData.agents)) {
            agents.push(...sessionData.agents);
          }
        } catch {
          // Skip invalid session files
        }
      }
      
      // If no agents found in sessions, create mock agents based on performance metrics
      if (agents.length === 0 && perfMetrics) {
        const activeCount = perfMetrics.activeAgents || 0;
        const totalCount = perfMetrics.totalAgents || 0;
        
        for (let i = 0; i < totalCount; i++) {
          agents.push({
            id: `agent-${i + 1}`,
            name: `Agent ${i + 1}`,
            type: i === 0 ? 'orchestrator' : 'worker',
            status: i < activeCount ? 'active' : 'idle',
            activeTasks: i < activeCount ? 1 : 0,
            lastActivity: Date.now() - (i * 1000)
          });
        }
      }
      
      return agents;
    } catch (error) {
      return [];
    }
  }

}
