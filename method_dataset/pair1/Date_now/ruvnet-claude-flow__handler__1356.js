function __method_wrapper__() {
    handler: async (input: any, context?: ClaudeFlowToolContext) => {
      logger.info('Spawning parallel agents', {
        count: input.agents?.length,
        sessionId: context?.sessionId
      });

      if (!context?.orchestrator) {
        throw new Error('Orchestrator not available');
      }

      const executor = context.orchestrator.getParallelExecutor();
      if (!executor) {
        throw new Error('ParallelSwarmExecutor not initialized');
      }

      // Convert input agents to ParallelAgentConfig format
      const agentConfigs = input.agents.map((agent: any) => ({
        agentId: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        agentType: agent.type,
        task: `Spawn ${agent.name} agent`,
        capabilities: agent.capabilities || [],
        priority: agent.priority || 'medium',
      }));

      const startTime = Date.now();
      const sessions = await executor.spawnParallelAgents(agentConfigs, {
        maxConcurrency: input.maxConcurrency || 5,
        batchSize: input.batchSize || 3,
      });

      const elapsedTime = Date.now() - startTime;

      return {
        success: true,
        agentsSpawned: sessions.size,
        sessions: Array.from(sessions.entries()).map(([id, session]) => ({
          agentId: id,
          sessionId: session.sessionId,
          status: session.status,
        })),
        performance: {
          totalTime: elapsedTime,
          averageTimePerAgent: elapsedTime / sessions.size,
          speedupVsSequential: `~${Math.round((sessions.size * 750) / elapsedTime)}x`,
        },
        timestamp: new Date().toISOString(),
      };
    },

}
