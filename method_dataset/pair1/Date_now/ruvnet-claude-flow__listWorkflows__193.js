async function listWorkflows(options: any): Promise<void> {
  try {
    // Mock workflow list - in production, this would query the orchestrator
    const workflows = await getRunningWorkflows(options.all);

    if (options.format === 'json') {
      console.log(JSON.stringify(workflows, null, 2));
      return;
    }

    if (workflows.length === 0) {
      console.log(chalk.gray('No workflows found'));
      return;
    }

    console.log(chalk.cyan.bold(`Workflows (${workflows.length})`));
    console.log('─'.repeat(60));

    const table = new Table.default({
      head: ['ID', 'Name', 'Status', 'Progress', 'Started', 'Duration'],
    });

    for (const workflow of workflows) {
      const statusIcon = formatStatusIndicator(workflow.status);
      const progress = `${workflow.progress.completed}/${workflow.progress.total}`;
      const progressBar = formatProgressBar(
        workflow.progress.completed,
        workflow.progress.total,
        10,
      );
      const duration = workflow.completedAt
        ? formatDuration(workflow.completedAt.getTime() - workflow.startedAt.getTime())
        : formatDuration(Date.now() - workflow.startedAt.getTime());

      table.push([
        chalk.gray(workflow.id.substring(0, 8) + '...'),
        chalk.white(workflow.workflowName),
        `${statusIcon} ${workflow.status}`,
        `${progressBar} ${progress}`,
        workflow.startedAt.toLocaleTimeString(),
        duration,
      ]);
    }

    console.log(table.toString());
  } catch (error) {
    console.error(chalk.red('Failed to list workflows:'), (error as Error).message);
  }
}
