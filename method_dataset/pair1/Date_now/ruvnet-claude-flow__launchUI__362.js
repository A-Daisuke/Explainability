export async function launchUI(): Promise<void> {
  const ui = createCompatibleUI();

  // Mock some example processes for demonstration
  const mockProcesses: UIProcess[] = [
    {
      id: 'orchestrator',
      name: 'Orchestrator Engine',
      status: 'running',
      type: 'core',
      pid: 12345,
      startTime: Date.now() - 30000,
      metrics: { cpu: 2.1, memory: 45.2, restarts: 0 },
    },
    {
      id: 'memory-manager',
      name: 'Memory Manager',
      status: 'running',
      type: 'service',
      pid: 12346,
      startTime: Date.now() - 25000,
      metrics: { cpu: 0.8, memory: 12.5, restarts: 0 },
    },
    {
      id: 'mcp-server',
      name: 'MCP Server',
      status: 'stopped',
      type: 'server',
      metrics: { restarts: 1 },
    },
  ];

  ui.updateProcesses(mockProcesses);

  console.log(chalk.green('✅ Starting Claude-Flow UI (compatible mode)'));
  console.log(chalk.gray('Note: Using compatible UI mode for broader terminal support'));
  console.log();

  await ui.start();
}
