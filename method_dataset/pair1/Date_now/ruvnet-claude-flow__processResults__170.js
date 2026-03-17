function __method_wrapper__() {
  private processResults(results: PromiseSettledResult<ParallelTaskResult>[]) {
    const totalDuration = Date.now() - this.startTime;
    
    console.log('\n' + '═'.repeat(60));
    console.log('📈 PARALLEL EXECUTION RESULTS');
    console.log('═'.repeat(60) + '\n');
    
    // Group results by agent type
    const resultsByAgent = new Map<string, ParallelTaskResult[]>();
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const taskResult = result.value;
        if (!resultsByAgent.has(taskResult.agentType)) {
          resultsByAgent.set(taskResult.agentType, []);
        }
        resultsByAgent.get(taskResult.agentType)!.push(taskResult);
      }
    });
    
    // Display results by agent
    resultsByAgent.forEach((tasks, agentType) => {
      console.log(`\n🤖 ${agentType.toUpperCase()} AGENT:`);
      console.log('─'.repeat(40));
      
      tasks.forEach(task => {
        const status = task.status === 'success' ? '✅' : '❌';
        console.log(`${status} ${task.taskName}`);
        console.log(`   Duration: ${task.duration}ms`);
        if (task.status === 'error') {
          console.log(`   Error: ${task.error}`);
        }
      });
    });
    
    // Calculate statistics
    const successfulTasks = results.filter(r => r.status === 'fulfilled' && r.value.status === 'success').length;
    const failedTasks = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.status === 'error')).length;
    const avgDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / this.results.length;
    
    // Display summary
    console.log('\n' + '═'.repeat(60));
    console.log('📊 EXECUTION SUMMARY');
    console.log('═'.repeat(60));
    console.log(`Total Tasks: ${results.length}`);
    console.log(`Successful: ${successfulTasks} (${((successfulTasks/results.length)*100).toFixed(1)}%)`);
    console.log(`Failed: ${failedTasks} (${((failedTasks/results.length)*100).toFixed(1)}%)`);
    console.log(`Total Execution Time: ${totalDuration}ms`);
    console.log(`Average Task Duration: ${Math.round(avgDuration)}ms`);
    console.log(`Parallelization Efficiency: ${((avgDuration * results.length / totalDuration) * 100).toFixed(1)}%`);
    
    // Find longest and shortest tasks
    const sortedTasks = [...this.results].sort((a, b) => b.duration - a.duration);
    console.log(`\nLongest Task: ${sortedTasks[0].taskName} (${sortedTasks[0].duration}ms)`);
    console.log(`Shortest Task: ${sortedTasks[sortedTasks.length-1].taskName} (${sortedTasks[sortedTasks.length-1].duration}ms)`);
    
    console.log('\n✨ Parallel execution demonstrates significant time savings');
    console.log('   compared to sequential execution of the same tasks.');
  }

}
