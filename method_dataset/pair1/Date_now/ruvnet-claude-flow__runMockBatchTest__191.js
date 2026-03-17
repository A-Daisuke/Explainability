export async function runMockBatchTest() {
  console.log('🧪 Running Mock Batch Task Test\n');
  
  const eventBus = new EventBus();
  const logger = new Logger({ level: 'info', format: 'json', destination: 'console' }, { component: 'mock-test' });
  const processor = new MockTaskProcessor(eventBus, logger);
  
  // Track metrics
  const metrics = {
    tasksCreated: 0,
    tasksCompleted: 0,
    tasksFailed: 0,
    totalProcessingTime: 0,
  };
  
  const taskStartTimes = new Map<string, number>();
  
  // Set up event tracking
  eventBus.on(SystemEvents.TASK_CREATED, () => metrics.tasksCreated++);
  eventBus.on(SystemEvents.TASK_STARTED, (data: any) => {
    taskStartTimes.set(data.taskId, Date.now());
  });
  eventBus.on(SystemEvents.TASK_COMPLETED, (data: any) => {
    metrics.tasksCompleted++;
    const startTime = taskStartTimes.get(data.taskId);
    if (startTime) {
      metrics.totalProcessingTime += Date.now() - startTime;
    }
  });
  eventBus.on(SystemEvents.TASK_FAILED, () => metrics.tasksFailed++);
  
  try {
    // Phase 1: Create agents
    console.log('📋 Creating agents...');
    const agents: AgentProfile[] = [
      {
        id: 'fast-agent-1',
        name: 'Fast Agent 1',
        type: 'implementer',
        capabilities: ['coding', 'testing'],
        systemPrompt: 'Fast processing agent',
        maxConcurrentTasks: 3,
        priority: 90,
      },
      {
        id: 'fast-agent-2',
        name: 'Fast Agent 2',
        type: 'implementer',
        capabilities: ['coding', 'optimization'],
        systemPrompt: 'Fast processing agent',
        maxConcurrentTasks: 3,
        priority: 90,
      },
      {
        id: 'research-agent',
        name: 'Research Agent',
        type: 'researcher',
        capabilities: ['research', 'analysis'],
        systemPrompt: 'Research agent',
        maxConcurrentTasks: 2,
        priority: 80,
      },
      {
        id: 'analyst-agent',
        name: 'Analyst Agent',
        type: 'analyst',
        capabilities: ['analysis', 'reporting'],
        systemPrompt: 'Analysis agent',
        maxConcurrentTasks: 4,
        priority: 70,
      },
    ];
    
    // Spawn agents in parallel
    await Promise.all(agents.map(agent => processor.spawnAgent(agent)));
    console.log(`✅ Spawned ${agents.length} agents\n`);
    
    // Phase 2: Create test tasks
    console.log('📋 Creating test tasks...');
    const taskBatches: Task[][] = [];
    
    // Batch 1: Coding tasks
    taskBatches.push([
      {
        id: 'code-1',
        type: 'implement',
        description: 'Implement feature A',
        priority: 90,
        dependencies: [],
        status: 'pending',
        input: { feature: 'A', parameters: { complexity: 'high' } },
        createdAt: new Date(),
        metadata: { requiredCapabilities: ['coding'] },
      },
      {
        id: 'code-2',
        type: 'implement',
        description: 'Implement feature B',
        priority: 85,
        dependencies: [],
        status: 'pending',
        input: { feature: 'B', parameters: { complexity: 'low' } },
        createdAt: new Date(),
        metadata: { requiredCapabilities: ['coding'] },
      },
      {
        id: 'code-3',
        type: 'implement',
        description: 'Optimize module C',
        priority: 80,
        dependencies: [],
        status: 'pending',
        input: { module: 'C', parameters: { complexity: 'high' } },
        createdAt: new Date(),
        metadata: { requiredCapabilities: ['coding', 'optimization'] },
      },
    ]);
    
    // Batch 2: Research tasks
    taskBatches.push([
      {
        id: 'research-1',
        type: 'research',
        description: 'Research algorithm X',
        priority: 95,
        dependencies: [],
        status: 'pending',
        input: { topic: 'algorithm X', parameters: { complexity: 'high' } },
        createdAt: new Date(),
        metadata: { requiredCapabilities: ['research'] },
      },
      {
        id: 'research-2',
        type: 'research',
        description: 'Analyze dataset Y',
        priority: 75,
        dependencies: [],
        status: 'pending',
        input: { dataset: 'Y', parameters: { complexity: 'low' } },
        createdAt: new Date(),
        metadata: { requiredCapabilities: ['research', 'analysis'] },
      },
    ]);
    
    // Batch 3: Analysis tasks
    taskBatches.push([
      {
        id: 'analyze-1',
        type: 'analyze',
        description: 'Analyze performance metrics',
        priority: 70,
        dependencies: [],
        status: 'pending',
        input: { metrics: 'performance', parameters: { complexity: 'low' } },
        createdAt: new Date(),
        metadata: { requiredCapabilities: ['analysis'] },
      },
      {
        id: 'report-1',
        type: 'report',
        description: 'Generate weekly report',
        priority: 60,
        dependencies: [],
        status: 'pending',
        input: { type: 'weekly', parameters: { complexity: 'low' } },
        createdAt: new Date(),
        metadata: { requiredCapabilities: ['reporting'] },
      },
    ]);
    
    console.log(`✅ Created ${taskBatches.length} task batches\n`);
    
    // Phase 3: Submit tasks in batches
    console.log('📋 Submitting tasks in batches...');
    const startTime = Date.now();
    
    for (let i = 0; i < taskBatches.length; i++) {
      const batch = taskBatches[i];
      console.log(`\n🚀 Submitting batch ${i + 1} (${batch.length} tasks)...`);
      
      // Submit all tasks in batch in parallel
      await Promise.all(batch.map(async task => {
        try {
          await processor.assignTask(task);
          console.log(`  ✅ Assigned: ${task.id} - ${task.description}`);
        } catch (error) {
          console.error(`  ❌ Failed to assign ${task.id}:`, error);
        }
      }));
      
      // Show current metrics
      const currentMetrics = processor.getMetrics();
      console.log(`  📊 Current state: ${currentMetrics.activeTasks} active, ${currentMetrics.queuedTasks} queued`);
    }
    
    console.log('\n⏳ Waiting for all tasks to complete...');
    
    // Monitor progress
    const progressInterval = setInterval(() => {
      const current = processor.getMetrics();
      console.log(`📊 Progress: ${metrics.tasksCompleted}/${metrics.tasksCreated} completed, ${current.activeTasks} active`);
    }, 1000);
    
    // Wait for all tasks to complete (with timeout)
    const timeout = 30000; // 30 seconds
    const checkInterval = 100;
    let elapsed = 0;
    
    while (metrics.tasksCompleted + metrics.tasksFailed < metrics.tasksCreated && elapsed < timeout) {
      await delay(checkInterval);
      elapsed += checkInterval;
    }
    
    clearInterval(progressInterval);
    
    const totalTime = Date.now() - startTime;
    
    // Phase 4: Display results
    console.log('\n' + '='.repeat(50));
    console.log('📊 FINAL RESULTS');
    console.log('='.repeat(50));
    console.log(`\n⏱️  Total execution time: ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`📋 Tasks created: ${metrics.tasksCreated}`);
    console.log(`✅ Tasks completed: ${metrics.tasksCompleted}`);
    console.log(`❌ Tasks failed: ${metrics.tasksFailed}`);
    console.log(`⚡ Average task time: ${(metrics.totalProcessingTime / metrics.tasksCompleted).toFixed(0)}ms`);
    console.log(`🚀 Throughput: ${(metrics.tasksCompleted / (totalTime / 1000)).toFixed(2)} tasks/second`);
    
    // Agent utilization
    console.log('\n👥 Agent Performance:');
    const agentMetrics = processor.getMetrics();
    console.log(`  Active agents: ${agentMetrics.activeAgents}`);
    console.log(`  Tasks per agent: ${(metrics.tasksCreated / agents.length).toFixed(1)}`);
    
    console.log('\n✅ Mock batch test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}
