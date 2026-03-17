async function postBashCommand(subArgs, flags) {
  const options = flags;
  const command = options.command || subArgs.slice(1).join(' ');
  const exitCode = options['exit-code'] || '0';
  const output = options.output || '';
  const trackMetrics = options['track-metrics'] || false;
  const storeResults = options['store-results'] || false;
  const duration = options.duration || 0;

  console.log(`🔧 Executing post-bash hook...`);
  console.log(`📜 Command: ${command}`);
  console.log(`📊 Exit code: ${exitCode}`);
  if (trackMetrics) console.log(`📊 Metrics tracking: ENABLED`);
  if (storeResults) console.log(`💾 Results storage: ENABLED`);

  try {
    const store = await getMemoryStore();
    const startTime = Date.now();

    // Calculate performance metrics if enabled
    let metrics = null;
    if (trackMetrics) {
      const commandLength = command.length;
      const outputLength = output.length;
      const success = parseInt(exitCode) === 0;

      metrics = {
        commandLength,
        outputLength,
        success,
        duration: parseInt(duration) || 0,
        exitCode: parseInt(exitCode),
        timestamp: new Date().toISOString(),
        complexity: commandLength > 100 ? 'high' : commandLength > 50 ? 'medium' : 'low',
      };

      console.log(
        `  📊 Command metrics: ${commandLength} chars, ${outputLength} output, ${success ? 'SUCCESS' : 'FAILED'}`,
      );
    }

    const bashData = {
      command,
      exitCode,
      output: storeResults ? output.substring(0, 5000) : output.substring(0, 1000), // Store more if requested
      timestamp: new Date().toISOString(),
      bashId: generateId('bash'),
      trackMetrics,
      storeResults,
      metrics,
    };

    await store.store(`bash:${bashData.bashId}:post`, bashData, {
      namespace: 'hooks:post-bash',
      metadata: { hookType: 'post-bash', command, exitCode, success: parseInt(exitCode) === 0 },
    });

    // Store detailed results if enabled
    if (storeResults) {
      await store.store(
        `command-results:${bashData.bashId}`,
        {
          command,
          exitCode,
          output,
          timestamp: new Date().toISOString(),
          fullOutput: true,
        },
        { namespace: 'command-results' },
      );

      console.log(`  💾 Full command results stored`);
    }

    // Store metrics if enabled
    if (trackMetrics && metrics) {
      await store.store(`command-metrics:${bashData.bashId}`, metrics, {
        namespace: 'performance-metrics',
      });

      // Update running metrics
      const existingMetrics = (await store.retrieve('command-metrics-summary', {
        namespace: 'performance-metrics',
      })) || { totalCommands: 0, successRate: 0, avgDuration: 0 };

      existingMetrics.totalCommands += 1;
      existingMetrics.successRate =
        (existingMetrics.successRate * (existingMetrics.totalCommands - 1) +
          (metrics.success ? 1 : 0)) /
        existingMetrics.totalCommands;
      existingMetrics.avgDuration =
        (existingMetrics.avgDuration * (existingMetrics.totalCommands - 1) + metrics.duration) /
        existingMetrics.totalCommands;
      existingMetrics.lastUpdated = new Date().toISOString();

      await store.store('command-metrics-summary', existingMetrics, {
        namespace: 'performance-metrics',
      });
    }

    // Update command history
    await store.store(
      `command-history:${Date.now()}`,
      {
        command,
        exitCode,
        timestamp: new Date().toISOString(),
        success: parseInt(exitCode) === 0,
        hasMetrics: trackMetrics,
        hasResults: storeResults,
      },
      { namespace: 'command-history' },
    );

    console.log(`  💾 Command execution logged to .swarm/memory.db`);
    printSuccess(`✅ Post-bash hook completed`);
  } catch (err) {
    printError(`Post-bash hook failed: ${err.message}`);
  }
}
