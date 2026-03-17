  async function (flags = {}) {
    console.log(chalk.yellow('\n🧙 Hive Mind - Non-Interactive Mode\n'));

    // Default to creating a swarm with sensible defaults
    console.log(chalk.cyan('Creating new swarm with default settings...'));
    console.log(chalk.gray('Use command-line flags to customize:'));
    console.log(chalk.gray('  --objective "Your task"    Set swarm objective'));
    console.log(chalk.gray('  --queen-type strategic     Set queen type'));
    console.log(chalk.gray('  --max-workers 8            Set worker count'));
    console.log();

    const objective = flags.objective || 'General task coordination';
    const config = {
      name: flags.name || `swarm-${Date.now()}`,
      queenType: flags.queenType || flags['queen-type'] || 'strategic',
      maxWorkers: parseInt(flags.maxWorkers || flags['max-workers'] || '8'),
      consensusAlgorithm: flags.consensus || flags.consensusAlgorithm || 'majority',
      autoScale: flags.autoScale || flags['auto-scale'] || false,
      namespace: flags.namespace || 'default',
      verbose: flags.verbose || false,
      encryption: flags.encryption || false,
    };

    await spawnSwarm([objective], {
      ...flags,
      name: config.name,
      queenType: config.queenType,
      maxWorkers: config.maxWorkers,
      consensusAlgorithm: config.consensusAlgorithm,
      autoScale: config.autoScale,
      encryption: config.encryption,
      nonInteractive: true,
    });
  },
