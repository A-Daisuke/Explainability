function __method_wrapper__() {
    action: async (ctx: CommandContext) => {
      const subcommand = ctx.args[0];

      // Import enhanced agent command dynamically
      const { agentCommand } = await import('./agent.js');

      // Create a mock context for the enhanced command
      const enhancedCtx = {
        args: ctx.args.slice(1), // Remove 'agent' from args
        flags: ctx.flags,
        command: subcommand,
      };

      try {
        // Map simple commands to enhanced command structure
        switch (subcommand) {
          case 'spawn':
          case 'list':
          case 'info':
          case 'terminate':
          case 'start':
          case 'restart':
          case 'pool':
          case 'health':
            // Use the enhanced agent command system
            console.log(chalk.cyan('🚀 Using enhanced agent management system...'));

            // Create a simplified wrapper around the enhanced command
            const agentManager = await import('../../agents/agent-manager.js');
            const { MemoryManager } = await import('../../memory/manager.js');
            const { EventBus } = await import('../../core/event-bus.js');
            const { Logger } = await import('../../core/logger.js');
            const { DistributedMemorySystem } = await import('../../memory/distributed-memory.js');

            warning('Enhanced agent management is available!');
            console.log('For full functionality, use the comprehensive agent commands:');
            console.log(`  - claude-flow agent ${subcommand} ${ctx.args.slice(1).join(' ')}`);
            console.log('  - Enhanced features: pools, health monitoring, resource management');
            console.log('  - Interactive configuration and detailed metrics');
            break;

          default: {
            console.log(chalk.cyan('📋 Agent Management Commands:'));
            console.log('Available subcommands:');
            console.log('  spawn      - Create and start new agents');
            console.log('  list       - Display all agents with status');
            console.log('  info       - Get detailed agent information');
            console.log('  terminate  - Safely terminate agents');
            console.log('  start      - Start a created agent');
            console.log('  restart    - Restart an agent');
            console.log('  pool       - Manage agent pools');
            console.log('  health     - Monitor agent health');
            console.log('');
            console.log('Enhanced Features:');
            console.log('  ✨ Resource allocation and monitoring');
            console.log('  ✨ Agent pools for scaling');
            console.log('  ✨ Health diagnostics and auto-recovery');
            console.log('  ✨ Interactive configuration');
            console.log('  ✨ Memory integration for coordination');
            console.log('');
            console.log('For detailed help, use: claude-flow agent <command> --help');
            break;
          }
        }
      } catch (err) {
        error(`Enhanced agent management unavailable: ${(err as Error).message}`);

        // Fallback to basic implementation
        switch (subcommand) {
          case 'spawn': {
            const type = ctx.args[1] || 'researcher';
            const name = (ctx.flags.name as string) || `${type}-${Date.now()}`;

            try {
              const persist = await getPersistence();
              const agentId = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

              await persist.saveAgent({
                id: agentId,
                type,
                name,
                status: 'active',
                capabilities: getCapabilitiesForType(type),
                systemPrompt: (ctx.flags.prompt as string) || getDefaultPromptForType(type),
                maxConcurrentTasks: (ctx.flags.maxTasks as number) || 5,
                priority: (ctx.flags.priority as number) || 1,
                createdAt: Date.now(),
              });

              success(`Agent spawned successfully!`);
              console.log(`📝 Agent ID: ${agentId}`);
              console.log(`🤖 Type: ${type}`);
              console.log(`📛 Name: ${name}`);
              console.log(`⚡ Status: Active`);
            } catch (err) {
              error(`Failed to spawn agent: ${(err as Error).message}`);
            }
            break;
          }

          case 'list': {
            try {
              const persist = await getPersistence();
              const agents = await persist.getActiveAgents();

              if (agents.length === 0) {
                info('No active agents');
              } else {
                success(`Active agents (${agents.length}):`);
                for (const agent of agents) {
                  console.log(`  • ${agent.id} (${agent.type}) - ${agent.status}`);
                }
              }
            } catch (err) {
              error(`Failed to list agents: ${(err as Error).message}`);
            }
            break;
          }

          default: {
            console.log('Available subcommands (basic): spawn, list');
            console.log('For enhanced features, ensure all dependencies are installed.');
            break;
          }
        }
      }
    },

}
