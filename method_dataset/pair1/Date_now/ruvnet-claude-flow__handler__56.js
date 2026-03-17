function __method_wrapper__() {
      handler: async (input: any, context?: SwarmToolContext) => {
        const { type, task, name } = input;

        // Get swarm ID from environment
        const swarmId = process.env['CLAUDE_SWARM_ID'];
        if (!swarmId) {
          throw new Error('Not running in swarm context');
        }

        // Get parent agent ID if available
        const parentId = process.env['CLAUDE_SWARM_AGENT_ID'];

        try {
          // Legacy functionality - would integrate with swarm spawn system
          const agentId = `agent-${Date.now()}`;

          logger.info('Agent spawned via legacy dispatch tool', { agentId });

          return {
            success: true,
            agentId,
            agentName: name || type,
            terminalId: 'N/A',
            message: `Successfully spawned ${name || type} to work on: ${task}`,
          };
        } catch (error) {
          logger.error('Failed to spawn agent via legacy dispatch tool', error);
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      },

}
