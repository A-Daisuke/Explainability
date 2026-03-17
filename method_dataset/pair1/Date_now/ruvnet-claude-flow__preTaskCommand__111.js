async function preTaskCommand(subArgs, flags) {
  const options = flags;
  const description = options.description || 'Unnamed task';
  const taskId = options['task-id'] || options.taskId || generateId('task');
  const agentId = options['agent-id'] || options.agentId;
  const autoSpawnAgents = options['auto-spawn-agents'] !== 'false';

  console.log(`🔄 Executing pre-task hook...`);
  console.log(`📋 Task: ${description}`);
  console.log(`🆔 Task ID: ${taskId}`);
  if (agentId) console.log(`🤖 Agent: ${agentId}`);

  try {
    const store = await getMemoryStore();
    const taskData = {
      taskId,
      description,
      agentId,
      autoSpawnAgents,
      status: 'started',
      startedAt: new Date().toISOString(),
    };

    await store.store(`task:${taskId}`, taskData, {
      namespace: 'hooks:pre-task',
      metadata: { hookType: 'pre-task', agentId },
    });

    await store.store(
      `task-index:${Date.now()}`,
      {
        taskId,
        description,
        timestamp: new Date().toISOString(),
      },
      { namespace: 'task-index' },
    );

    console.log(`  💾 Saved to .swarm/memory.db`);

    // Execute ruv-swarm hook if available (with timeout for npx scenarios)
    try {
      const checkPromise = checkRuvSwarmAvailable();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      );
      
      const isAvailable = await Promise.race([checkPromise, timeoutPromise]);
      
      if (isAvailable) {
        console.log(`\n🔄 Executing ruv-swarm pre-task hook...`);
        const hookResult = await execRuvSwarmHook('pre-task', {
          description,
          'task-id': taskId,
          'auto-spawn-agents': autoSpawnAgents,
          ...(agentId ? { 'agent-id': agentId } : {}),
        });

        if (hookResult.success) {
          await store.store(
            `task:${taskId}:ruv-output`,
            {
              output: hookResult.output,
              timestamp: new Date().toISOString(),
            },
            { namespace: 'hooks:ruv-swarm' },
          );

          printSuccess(`✅ Pre-task hook completed successfully`);
        }
      }
    } catch (err) {
      // Skip ruv-swarm hook if it times out or fails
      console.log(`\n⚠️  Skipping ruv-swarm hook (${err.message})`);
    }

    console.log(`\n🎯 TASK PREPARATION COMPLETE`);
    
    // Close the memory store to prevent hanging
    if (memoryStore && memoryStore.close) {
      memoryStore.close();
    }
    
    // Force exit after a short delay to ensure cleanup
    setTimeout(() => {
      process.exit(0);
    }, 100);
  } catch (err) {
    printError(`Pre-task hook failed: ${err.message}`);
    
    // Close the memory store on error too
    if (memoryStore && memoryStore.close) {
      memoryStore.close();
    }
    
    // Force exit after a short delay to ensure cleanup
    setTimeout(() => {
      process.exit(1);
    }, 100);
  }
}
