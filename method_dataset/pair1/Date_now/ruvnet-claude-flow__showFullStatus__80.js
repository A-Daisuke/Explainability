function showFullStatus(status: any): void {
  // System overview
  console.log(chalk.cyan.bold('System Overview'));
  console.log('─'.repeat(50));

  const statusIcon = formatStatusIndicator(status.overall);
  console.log(
    `${statusIcon} Overall Status: ${getStatusColor(status.overall)(status.overall.toUpperCase())}`,
  );
  console.log(`${chalk.white('Uptime:')} ${formatDuration(status.uptime)}`);
  console.log(`${chalk.white('Version:')} ${status.version}`);
  console.log(`${chalk.white('Started:')} ${new Date(status.startTime).toLocaleString()}`);
  console.log();

  // Components status
  console.log(chalk.cyan.bold('Components'));
  console.log('─'.repeat(50));

  const componentRows = [];
  for (const [name, component] of Object.entries(status.components)) {
    const comp = component as any;
    const statusIcon = formatStatusIndicator(comp.status);
    const statusText = getStatusColor(comp.status)(comp.status.toUpperCase());

    componentRows.push([
      chalk.white(name),
      `${statusIcon} ${statusText}`,
      formatDuration(comp.uptime || 0),
      comp.details || '-',
    ]);
  }

  const componentTable = new Table({
    head: ['Component', 'Status', 'Uptime', 'Details'],
  });
  componentTable.push(...componentRows);

  console.log(componentTable.toString());
  console.log();

  // Resource usage
  if (status.resources) {
    console.log(chalk.cyan.bold('Resource Usage'));
    console.log('─'.repeat(50));

    const resourceRows = [];
    for (const [name, resource] of Object.entries(status.resources)) {
      const res = resource as any;
      const percentage = ((res.used / res.total) * 100).toFixed(1);
      const color = getResourceColor(parseFloat(percentage));

      resourceRows.push([
        chalk.white(name),
        res.used.toString(),
        res.total.toString(),
        color(`${percentage}%`),
      ]);
    }

    const resourceTable = new Table({
      head: ['Resource', 'Used', 'Total', 'Percentage'],
    });
    resourceTable.push(...resourceRows);

    console.log(resourceTable.toString());
    console.log();
  }

  // Active agents
  if (status.agents) {
    console.log(chalk.cyan.bold(`Active Agents (${status.agents.length})`));
    console.log('─'.repeat(50));

    if (status.agents.length > 0) {
      const agentRows = [];
      for (const agent of status.agents) {
        const statusIcon = formatStatusIndicator(agent.status);
        const statusText = getStatusColor(agent.status)(agent.status);

        agentRows.push([
          chalk.gray(agent.id.slice(0, 8)),
          chalk.white(agent.name),
          agent.type,
          `${statusIcon} ${statusText}`,
          agent.activeTasks.toString(),
        ]);
      }

      const agentTable = new Table({
        head: ['ID', 'Name', 'Type', 'Status', 'Tasks'],
      });
      agentTable.push(...agentRows);

      console.log(agentTable.toString());
    } else {
      console.log(chalk.gray('No active agents'));
    }
    console.log();
  }

  // Recent tasks
  if (status.recentTasks) {
    console.log(chalk.cyan.bold('Recent Tasks'));
    console.log('─'.repeat(50));

    if (status.recentTasks.length > 0) {
      const taskRows = [];
      for (const task of status.recentTasks.slice(0, 10)) {
        const statusIcon = formatStatusIndicator(task.status);
        const statusText = getStatusColor(task.status)(task.status);

        taskRows.push([
          chalk.gray(task.id.slice(0, 8)),
          task.type,
          `${statusIcon} ${statusText}`,
          formatDuration(Date.now() - new Date(task.startTime).getTime()),
          task.assignedTo ? chalk.gray(task.assignedTo.slice(0, 8)) : '-',
        ]);
      }

      const taskTable = new Table({
        head: ['ID', 'Type', 'Status', 'Duration', 'Agent'],
      });
      taskTable.push(...taskRows);

      console.log(taskTable.toString());
    } else {
      console.log(chalk.gray('No recent tasks'));
    }
  }
}
