function displayWorkflowStatus(execution: WorkflowExecution): void {
  console.log(chalk.cyan.bold('Workflow Status'));
  console.log('─'.repeat(50));

  const statusIcon = formatStatusIndicator(execution.status);
  const duration = execution.completedAt
    ? formatDuration(execution.completedAt.getTime() - execution.startedAt.getTime())
    : formatDuration(Date.now() - execution.startedAt.getTime());

  console.log(`${chalk.white('Name:')} ${execution.workflowName}`);
  console.log(`${chalk.white('ID:')} ${execution.id}`);
  console.log(`${chalk.white('Status:')} ${statusIcon} ${execution.status}`);
  console.log(`${chalk.white('Started:')} ${execution.startedAt.toLocaleString()}`);
  console.log(`${chalk.white('Duration:')} ${duration}`);

  const progressBar = formatProgressBar(
    execution.progress.completed,
    execution.progress.total,
    40,
    'Progress',
  );
  console.log(`${progressBar} ${execution.progress.completed}/${execution.progress.total}`);

  if (execution.progress.failed > 0) {
    console.log(
      `${chalk.white('Failed Tasks:')} ${chalk.red(execution.progress.failed.toString())}`,
    );
  }
  console.log();

  // Task details
  console.log(chalk.cyan.bold('Tasks'));
  console.log('─'.repeat(50));

  const table = new Table.default({
    head: ['Task', 'Status', 'Duration', 'Agent'],
  });

  for (const taskExec of execution.tasks) {
    const statusIcon = formatStatusIndicator(taskExec.status);
    const duration =
      taskExec.completedAt && taskExec.startedAt
        ? formatDuration(taskExec.completedAt.getTime() - taskExec.startedAt.getTime())
        : taskExec.startedAt
          ? formatDuration(Date.now() - taskExec.startedAt.getTime())
          : '-';

    table.push([
      chalk.white(taskExec.taskId),
      `${statusIcon} ${taskExec.status}`,
      duration,
      taskExec.assignedAgent || '-',
    ]);
  }

  console.log(table.toString());
}
