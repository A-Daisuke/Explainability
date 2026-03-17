async function createSwarmWizard() {
  console.log('\n' + chalk.bold('🆕 Create New Hive Mind Swarm'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Swarm name:',
      default: `hive-mind-${Date.now()}`,
      validate: (input) => input.length > 0 || 'Name is required',
    },
    {
      type: 'list',
      name: 'topology',
      message: 'Select swarm topology:',
      choices: [
        { name: '🏛️ Hierarchical - Queen-led with clear command structure', value: 'hierarchical' },
        { name: '🕸️ Mesh - Fully connected peer-to-peer network', value: 'mesh' },
        { name: '🔄 Ring - Circular communication pattern', value: 'ring' },
        { name: '⭐ Star - Central hub with radiating connections', value: 'star' },
      ],
    },
    {
      type: 'list',
      name: 'queenMode',
      message: 'Queen coordination mode:',
      choices: [
        { name: '👑 Centralized - Single Queen controls all decisions', value: 'centralized' },
        { name: '🤝 Distributed - Multiple Queens share leadership', value: 'distributed' },
      ],
    },
    {
      type: 'number',
      name: 'maxAgents',
      message: 'Maximum number of agents:',
      default: 8,
      validate: (input) => (input > 0 && input <= 100) || 'Must be between 1 and 100',
    },
    {
      type: 'number',
      name: 'consensusThreshold',
      message: 'Consensus threshold (0.5 - 1.0):',
      default: 0.66,
      validate: (input) => (input >= 0.5 && input <= 1.0) || 'Must be between 0.5 and 1.0',
    },
    {
      type: 'confirm',
      name: 'autoSpawn',
      message: 'Auto-spawn initial agents?',
      default: true,
    },
  ]);

  // Advanced options
  const { showAdvanced } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'showAdvanced',
      message: 'Configure advanced options?',
      default: false,
    },
  ]);

  if (showAdvanced) {
    const advanced = await inquirer.prompt([
      {
        type: 'number',
        name: 'memoryTTL',
        message: 'Default memory TTL (seconds):',
        default: 86400,
      },
      {
        type: 'checkbox',
        name: 'enabledFeatures',
        message: 'Enable features:',
        choices: [
          { name: 'Neural Learning', value: 'neural', checked: true },
          { name: 'Performance Monitoring', value: 'monitoring', checked: true },
          { name: 'Auto-scaling', value: 'autoscale', checked: false },
          { name: 'Fault Tolerance', value: 'faultTolerance', checked: true },
          { name: 'Predictive Task Assignment', value: 'predictive', checked: false },
        ],
      },
    ]);

    Object.assign(answers, advanced);
  }

  // Create swarm
  const spinner = require('ora')('Creating Hive Mind swarm...').start();

  try {
    const hiveMind = new HiveMind({
      name: answers.name,
      topology: answers.topology,
      maxAgents: answers.maxAgents,
      queenMode: answers.queenMode,
      memoryTTL: answers.memoryTTL || 86400,
      consensusThreshold: answers.consensusThreshold,
      autoSpawn: answers.autoSpawn,
      enabledFeatures: answers.enabledFeatures || ['neural', 'monitoring', 'faultTolerance'],
      createdAt: new Date(),
    });

    const swarmId = await hiveMind.initialize();

    spinner.succeed(formatSuccess('Hive Mind created successfully!'));
    console.log(formatInfo(`Swarm ID: ${swarmId}`));

    if (answers.autoSpawn) {
      const agents = await hiveMind.autoSpawnAgents();
      console.log(formatSuccess(`Spawned ${agents.length} initial agents`));
    }
  } catch (error) {
    spinner.fail(formatError('Failed to create swarm'));
    throw error;
  }
}
