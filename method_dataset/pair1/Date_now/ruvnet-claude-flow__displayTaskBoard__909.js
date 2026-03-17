function __method_wrapper__() {
  displayTaskBoard(taskStatuses, highlightTasks = []) {
    // In quiet mode, just show simple progress
    if (this.options.logLevel === 'quiet') {
      const totalTasks = taskStatuses.size;
      const completedTasks = Array.from(taskStatuses.values()).filter(s => s.status === 'completed').length;
      const activeTasks = Array.from(taskStatuses.values()).filter(s => s.status === 'in-progress').length;
      console.log(`📊 Progress: ${completedTasks}/${totalTasks} completed, ${activeTasks} active`);
      return;
    }
    
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    const frameIndex = Math.floor(Date.now() / 100) % frames.length;
    const spinner = frames[frameIndex];
    
    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║                    🤖 CONCURRENT TASK STATUS                   ║');
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    
    // Group by status
    const statusGroups = {
      'in-progress': [],
      'completed': [],
      'failed': [],
      'pending': []
    };
    
    taskStatuses.forEach((status, taskId) => {
      statusGroups[status.status].push({ taskId, ...status });
    });
    
    // Show in-progress tasks with animation
    if (statusGroups['in-progress'].length > 0) {
      console.log(`║ ${spinner} RUNNING (${statusGroups['in-progress'].length} agents):                                      ║`);
      statusGroups['in-progress'].forEach(task => {
        const duration = task.startTime ? this.formatDuration(Date.now() - task.startTime) : '';
        const progress = this.getProgressBar(Date.now() - task.startTime, 60000); // 1 min expected
        const agentIcon = this.getAgentIcon(task.agent);
        console.log(`║   ${agentIcon} ${task.name.padEnd(25)} ${progress} ${duration.padStart(8)} ║`);
      });
    }
    
    // Show completed tasks
    if (statusGroups['completed'].length > 0) {
      console.log(`║ ✅ COMPLETED (${statusGroups['completed'].length}):                                           ║`);
      statusGroups['completed'].forEach(task => {
        const duration = task.endTime && task.startTime ? 
          this.formatDuration(task.endTime - task.startTime) : '';
        console.log(`║   ✓ ${task.name.padEnd(35)} ${duration.padStart(10)} ║`);
      });
    }
    
    // Show failed tasks
    if (statusGroups['failed'].length > 0) {
      console.log(`║ ❌ FAILED (${statusGroups['failed'].length}):                                              ║`);
      statusGroups['failed'].forEach(task => {
        const errorMsg = (task.summary || '').substring(0, 25);
        console.log(`║   ✗ ${task.name.padEnd(25)} ${errorMsg.padEnd(20)} ║`);
      });
    }
    
    // Show pending tasks count
    if (statusGroups['pending'].length > 0) {
      console.log(`║ ⏳ QUEUED: ${statusGroups['pending'].length} tasks waiting                                 ║`);
    }
    
    // Summary stats
    const total = taskStatuses.size;
    const completed = statusGroups['completed'].length;
    const failed = statusGroups['failed'].length;
    const progress = total > 0 ? Math.floor((completed + failed) / total * 100) : 0;
    
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log(`║ 📊 Progress: ${progress}% (${completed}/${total}) │ ⚡ Active: ${statusGroups['in-progress'].length} │ ❌ Failed: ${failed}  ║`);
    console.log('╚═══════════════════════════════════════════════════════════════╝');
  }

}
