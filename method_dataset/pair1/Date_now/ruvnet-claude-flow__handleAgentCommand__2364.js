  async function handleAgentCommand(args, state) {
    const subCmd = args[0];
    switch (subCmd) {
      case 'spawn':
        const rawType = args[1] || 'researcher';
        const type = resolveLegacyAgentType(rawType);
        const name = args[2] || `agent-${Date.now()}`;
        const agent = {
          id: `agent-${Date.now()}`,
          type,
          name,
          status: 'active',
          created: new Date().toISOString(),
        };
        state.context.agents.push(agent);
        printSuccess(`Spawned ${type} agent: ${name} (${agent.id})`);
        break;

      case 'list':
        if (state.context.agents.length === 0) {
          console.log('No active agents');
        } else {
          console.log('Active agents:');
          state.context.agents.forEach((agent) => {
            console.log(`  ${agent.id} - ${agent.name} (${agent.type}) - ${agent.status}`);
          });
        }
        break;

      case 'info':
        const agentId = args[1];
        const foundAgent = state.context.agents.find((a) => a.id === agentId || a.name === agentId);
        if (foundAgent) {
          console.log(`Agent: ${foundAgent.name}`);
          console.log(`  ID: ${foundAgent.id}`);
          console.log(`  Type: ${foundAgent.type}`);
          console.log(`  Status: ${foundAgent.status}`);
          console.log(`  Created: ${foundAgent.created}`);
        } else {
          printError(`Agent not found: ${agentId}`);
        }
        break;

      case 'terminate':
        const termId = args[1];
        const index = state.context.agents.findIndex((a) => a.id === termId || a.name === termId);
        if (index >= 0) {
          const removed = state.context.agents.splice(index, 1)[0];
          printSuccess(`Terminated agent: ${removed.name}`);
        } else {
          printError(`Agent not found: ${termId}`);
        }
        break;

      default:
        console.log('Agent commands: spawn, list, info, terminate');
    }
  }
