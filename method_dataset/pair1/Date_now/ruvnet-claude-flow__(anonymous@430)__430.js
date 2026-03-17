  const executions = Array.from(assignments.entries()).map(async ([task, agentId]) => {
    const agent = agents.find((a) => a.id === agentId)!;
    agent.status = 'executing';

    console.log(`  ⚡ ${agent.type}-${agent.id} executing: ${task}`);

    // Simulate execution
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

    agent.status = 'idle';
    console.log(`  ✅ ${agent.type}-${agent.id} completed: ${task}`);

    // Store execution result
    await memory.store(`execution/${agentId}/${Date.now()}`, {
      task,
      agent: agent.id,
      status: 'completed',
      timestamp: new Date().toISOString(),
    });
  });
