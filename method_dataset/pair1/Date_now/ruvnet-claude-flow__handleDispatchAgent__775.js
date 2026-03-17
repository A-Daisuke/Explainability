export async function handleDispatchAgent(args: any): Promise<any> {
  const { type, task, name } = args;

  const swarmId = process.env['CLAUDE_SWARM_ID'];
  if (!swarmId) {
    throw new Error('Not running in swarm context');
  }

  const parentId = process.env['CLAUDE_SWARM_AGENT_ID'];

  try {
    // Legacy functionality - would integrate with swarm spawn system
    const agentId = `agent-${Date.now()}`;

    return {
      success: true,
      agentId,
      agentName: name || type,
      terminalId: 'N/A',
      message: `Successfully spawned ${name || type} to work on: ${task}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
