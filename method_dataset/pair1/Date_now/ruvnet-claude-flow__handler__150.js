function __method_wrapper__() {
    handler: async (input: any, context?: ClaudeFlowToolContext) => {
      logger.info('Spawning agent', { input, sessionId: context?.sessionId });

      if (!context?.orchestrator) {
        throw new Error('Orchestrator not available');
      }

      const profile: AgentProfile = {
        id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: input.name,
        type: input.type,
        capabilities: input.capabilities || [],
        systemPrompt: input.systemPrompt || getDefaultSystemPrompt(input.type),
        maxConcurrentTasks: input.maxConcurrentTasks || 3,
        priority: input.priority || 5,
        environment: input.environment,
        workingDirectory: input.workingDirectory,
      };

      const sessionId = await context.orchestrator.spawnAgent(profile);

      return {
        agentId: profile.id,
        sessionId,
        profile,
        status: 'spawned',
        timestamp: new Date().toISOString(),
      };
    },

}
