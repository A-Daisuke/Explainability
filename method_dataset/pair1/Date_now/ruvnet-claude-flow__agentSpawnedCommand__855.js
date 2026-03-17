async function agentSpawnedCommand(subArgs, flags) {
  const options = flags;
  const agentType = options.type || 'generic';
  const agentName = options.name || generateId('agent');
  const swarmId = options['swarm-id'] || 'default';

  console.log(`🤖 Executing agent-spawned hook...`);
  console.log(`📛 Agent: ${agentName}`);
  console.log(`🏷️  Type: ${agentType}`);

  try {
    const store = await getMemoryStore();
    const agentData = {
      agentName,
      agentType,
      swarmId,
      spawnedAt: new Date().toISOString(),
      status: 'active',
    };

    await store.store(`agent:${agentName}`, agentData, {
      namespace: 'hooks:agent-spawned',
      metadata: { hookType: 'agent-spawned', type: agentType },
    });

    // Update agent roster
    await store.store(
      `agent-roster:${Date.now()}`,
      {
        agentName,
        action: 'spawned',
        timestamp: new Date().toISOString(),
      },
      { namespace: 'agent-roster' },
    );

    console.log(`  💾 Agent registered to .swarm/memory.db`);
    printSuccess(`✅ Agent spawned hook completed`);
  } catch (err) {
    printError(`Agent spawned hook failed: ${err.message}`);
  }
}
