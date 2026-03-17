async function postTaskCommand(subArgs, flags) {
  const options = flags;
  const taskId = options['task-id'] || options.taskId || generateId('task');
  const analyzePerformance = options['analyze-performance'] !== 'false';

  console.log(`🏁 Executing post-task hook...`);
  console.log(`🆔 Task ID: ${taskId}`);

  try {
    const store = await getMemoryStore();
    const taskData = await store.retrieve(`task:${taskId}`, {
      namespace: 'hooks:pre-task',
    });

    const completedData = {
      ...(taskData || {}),
      status: 'completed',
      completedAt: new Date().toISOString(),
      duration: taskData ? Date.now() - new Date(taskData.startedAt).getTime() : null,
    };

    await store.store(`task:${taskId}:completed`, completedData, {
      namespace: 'hooks:post-task',
      metadata: { hookType: 'post-task' },
    });

    if (analyzePerformance && completedData.duration) {
      const metrics = {
        taskId,
        duration: completedData.duration,
        durationHuman: `${(completedData.duration / 1000).toFixed(2)}s`,
        timestamp: new Date().toISOString(),
      };

      await store.store(`metrics:${taskId}`, metrics, {
        namespace: 'performance',
      });
      console.log(`  📊 Performance: ${metrics.durationHuman}`);
    }

    console.log(`  💾 Task completion saved to .swarm/memory.db`);
    printSuccess(`✅ Post-task hook completed`);
  } catch (err) {
    printError(`Post-task hook failed: ${err.message}`);
  }
}
