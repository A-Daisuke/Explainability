export async function spawnSwarmAgent(
  swarmId: string,
  agentType: string,
  task: string,
): Promise<string> {
  const swarm = swarmStates.get(swarmId);
  if (!swarm) {
    throw new Error(`Swarm ${swarmId} not found`);
  }

  const agentId = `${swarmId}-agent-${Date.now()}`;
  const agent: Agent = {
    id: agentId,
    type: agentType,
    status: 'active',
    name: `${agentType}-${agentId}`,
    task: task,
  };
  swarm.agents.set(agentId, agent);

  // In a real implementation, this would spawn actual Claude instances
  console.log(`[SWARM] Spawned ${agentType} agent: ${agentId}`);
  console.log(`[SWARM] Task: ${task}`);

  return agentId;
}
