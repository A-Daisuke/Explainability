async function getRunningWorkflows(includeAll = false): Promise<WorkflowExecution[]> {
  // Mock workflow list - in production, this would query the orchestrator
  return [
    {
      id: 'workflow-001',
      workflowName: 'Research Workflow',
      status: 'running' as const,
      startedAt: new Date(Date.now() - 120000), // 2 minutes ago
      progress: { total: 5, completed: 3, failed: 0 },
      tasks: [],
    },
    {
      id: 'workflow-002',
      workflowName: 'Implementation Workflow',
      status: 'completed' as const,
      startedAt: new Date(Date.now() - 300000), // 5 minutes ago
      completedAt: new Date(Date.now() - 60000), // 1 minute ago
      progress: { total: 3, completed: 3, failed: 0 },
      tasks: [],
    },
  ].filter((w) => includeAll || w.status === 'running');
}
