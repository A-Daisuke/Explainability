function __method_wrapper__() {
  async executeWorkflowTasks(workflow) {
    const { tasks, dependencies = {} } = workflow;
    
    let completedTasks = 0;
    let failedTasks = 0;
    const totalTasks = tasks.length;
    
    // Task status tracking
    const taskStatuses = new Map();
    tasks.forEach(task => {
      taskStatuses.set(task.id, {
        name: task.name || task.id,
        status: 'pending',
        agent: task.assignTo,
        startTime: null,
        endTime: null,
        summary: ''
      });
    });
    
    // Create task execution plan based on dependencies
    const executionPlan = this.createExecutionPlan(tasks, dependencies);
    
    console.log(`📋 Executing ${totalTasks} tasks in ${executionPlan.length} phases...`);
    console.log();
    
    // Note: Concurrent display disabled in favor of interactive-style stream processing
    let concurrentDisplay = null;
    // if (this.options.nonInteractive && this.options.outputFormat === 'stream-json') {
    //   const { createConcurrentDisplay } = await import('./concurrent-display.js');
    //   
    //   // Get all agents and their tasks
    //   const agentTasks = workflow.agents?.map(agent => ({
    //     id: agent.id,
    //     name: agent.name,
    //     type: agent.type,
    //     tasks: tasks.filter(t => t.assignTo === agent.id).map(t => t.name)
    //   })) || [];
    //   
    //   concurrentDisplay = createConcurrentDisplay(agentTasks);
    //   concurrentDisplay.start();
    //   
    //   // Store reference for stream processors
    //   this.concurrentDisplay = concurrentDisplay;
    // }
    
    // Execute tasks phase by phase
    for (const [phaseIndex, phaseTasks] of executionPlan.entries()) {
      this.currentPhase = `Phase ${phaseIndex + 1}`;
      
      // Show regular task board or update concurrent display
      if (!concurrentDisplay) {
        if (this.options.logLevel === 'quiet') {
          console.log(`\n🔄 Phase ${phaseIndex + 1}: Running ${phaseTasks.length} tasks`);
        } else {
          console.log(`\n🔄 Phase ${phaseIndex + 1}: ${phaseTasks.length} concurrent tasks`);
        }
        this.displayTaskBoard(taskStatuses, phaseTasks);
      }
      
      // Mark tasks as in-progress
      phaseTasks.forEach(task => {
        const status = taskStatuses.get(task.id);
        status.status = 'in-progress';
        status.startTime = Date.now();
      });
      
      // Execute tasks in this phase (potentially in parallel)
      const phasePromises = phaseTasks.map(async (task) => {
        const taskStatus = taskStatuses.get(task.id);
        
        try {
          // Show task starting
          console.log(`\n  🚀 Starting: ${task.name || task.id}`);
          console.log(`     Agent: ${task.assignTo}`);
          console.log(`     Description: ${task.description?.substring(0, 80)}...`);
          
          const result = await this.executeTask(task, workflow);
          
          taskStatus.status = result.success ? 'completed' : 'failed';
          taskStatus.endTime = Date.now();
          taskStatus.summary = result.success ? 
            `✅ Completed in ${this.formatDuration(result.duration)}` :
            `❌ Failed: ${result.error?.message || 'Unknown error'}`;
          
          return result;
        } catch (error) {
          taskStatus.status = 'failed';
          taskStatus.endTime = Date.now();
          taskStatus.summary = `❌ Error: ${error.message}`;
          throw error;
        }
      });
      
      // Wait for all phase tasks to complete
      const phaseResults = await Promise.allSettled(phasePromises);
      
      // Process phase results
      for (const [taskIndex, result] of phaseResults.entries()) {
        const task = phaseTasks[taskIndex];
        const taskStatus = taskStatuses.get(task.id);
        
        if (result.status === 'fulfilled' && result.value.success) {
          completedTasks++;
          this.results.set(task.id, result.value);
        } else {
          failedTasks++;
          const error = result.status === 'rejected' ? result.reason : result.value.error;
          this.errors.push({
            type: 'task_execution',
            task: task.id,
            error: error.message || error,
            timestamp: new Date()
          });
          
          // Check if we should fail fast
          if (workflow.settings?.failurePolicy === 'fail-fast') {
            console.log(`\n🛑 Failing fast due to task failure`);
            break;
          }
        }
      }
      
      // Show updated task board
      if (!concurrentDisplay) {
        console.log(`\n📊 Phase ${phaseIndex + 1} Complete:`);
        this.displayTaskBoard(taskStatuses);
      }
      
      // Stop if fail-fast and we have failures
      if (workflow.settings?.failurePolicy === 'fail-fast' && failedTasks > 0) {
        break;
      }
    }
    
    // Final summary
    if (!concurrentDisplay) {
      console.log(`\n📊 Final Workflow Summary:`);
      this.displayTaskBoard(taskStatuses);
    } else {
      // Stop concurrent display
      concurrentDisplay.stop();
      console.log(); // Add some space after display
    }
    
    return {
      success: failedTasks === 0,
      totalTasks,
      completedTasks,
      failedTasks,
      executionId: this.executionId,
      duration: Date.now() - this.startTime,
      results: Object.fromEntries(this.results),
      errors: this.errors
    };
  }

}
