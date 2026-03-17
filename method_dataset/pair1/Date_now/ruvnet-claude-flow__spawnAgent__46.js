async function spawnAgent(subArgs, flags) {
  const agentType = subArgs[1] || 'general';
  const agentName = getFlag(subArgs, '--name') || flags.name || `agent-${Date.now()}`;
  const agentId = `${agentType}-${Date.now()}`;

  // Create the agent object
  const agent = {
    id: agentId,
    name: agentName,
    type: agentType,
    status: 'active',
    activeTasks: 0,
    lastActivity: Date.now(),
    capabilities: getAgentCapabilities(agentType),
    createdAt: Date.now()
  };

  // Store agent in session/agents directory
  const { promises: fs } = await import('fs');
  const path = await import('path');
  
  // Ensure agents directory exists
  const agentsDir = '.claude-flow/agents';
  await fs.mkdir(agentsDir, { recursive: true });
  
  // Save agent data
  const agentFile = path.join(agentsDir, `${agentId}.json`);
  await fs.writeFile(agentFile, JSON.stringify(agent, null, 2));
  
  // Update performance metrics
  const perfFile = '.claude-flow/metrics/performance.json';
  try {
    const perfData = JSON.parse(await fs.readFile(perfFile, 'utf8'));
    perfData.totalAgents = (perfData.totalAgents || 0) + 1;
    perfData.activeAgents = (perfData.activeAgents || 0) + 1;
    await fs.writeFile(perfFile, JSON.stringify(perfData, null, 2));
  } catch (e) {
    // Create new performance file if doesn't exist
    await fs.writeFile(perfFile, JSON.stringify({
      startTime: Date.now(),
      totalTasks: 0,
      successfulTasks: 0,
      failedTasks: 0,
      totalAgents: 1,
      activeAgents: 1,
      neuralEvents: 0
    }, null, 2));
  }

  printSuccess(`✅ Spawned ${agentType} agent: ${agentName}`);
  console.log('🤖 Agent successfully created:');
  console.log(`   ID: ${agentId}`);
  console.log(`   Type: ${agentType}`);
  console.log(`   Name: ${agentName}`);
  console.log(`   Capabilities: ${agent.capabilities.join(', ')}`);
  console.log(`   Status: ${agent.status}`);
  console.log(`   Location: ${agentFile}`);
  
  // Track agent spawn for performance metrics
  await onAgentSpawn(agentId, agentType, { name: agentName });
}
