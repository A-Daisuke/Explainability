async function interactiveAgentConfiguration(manager: AgentManager): Promise<any> {
  console.log(chalk.cyan('\n🛠️  Interactive Agent Configuration'));

  const templates = manager.getAgentTemplates();
  const templateChoices = templates.map((t) => ({ name: `${t.name} (${t.type})`, value: t.name }));

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Select agent template:',
      choices: templateChoices,
    },
    {
      type: 'input',
      name: 'name',
      message: 'Agent name:',
      default: `agent-${Date.now().toString(36)}`,
    },
    {
      type: 'input',
      name: 'autonomyLevel',
      message: 'Autonomy level (0-1):',
      default: '0.7',
      validate: (value) => {
        const num = parseFloat(value);
        return (num >= 0 && num <= 1) || 'Must be between 0 and 1';
      },
    },
    {
      type: 'input',
      name: 'maxTasks',
      message: 'Maximum concurrent tasks:',
      default: '5',
      validate: (value) => {
        const num = parseInt(value);
        return (num > 0 && num <= 20) || 'Must be between 1 and 20';
      },
    },
    {
      type: 'input',
      name: 'maxMemory',
      message: 'Memory limit (MB):',
      default: '512',
      validate: (value) => {
        const num = parseInt(value);
        return (num >= 128 && num <= 4096) || 'Must be between 128 and 4096';
      },
    },
  ]);

  return {
    template: answers.template,
    name: answers.name,
    config: {
      autonomyLevel: parseFloat(answers.autonomyLevel),
      maxConcurrentTasks: parseInt(answers.maxTasks),
      timeoutThreshold: 300000,
    },
    environment: {
      maxMemoryUsage: parseInt(answers.maxMemory) * 1024 * 1024,
    },
  };
}
