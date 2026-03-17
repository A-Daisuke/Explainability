function __method_wrapper__() {
  async executeTrainingRun(tasks, agentConfig = {}) {
    const results = [];
    
    for (const task of tasks) {
      console.log(`\n🔄 Executing task: ${task.task}`);
      
      // Install dependencies (only once per task)
      try {
        console.log(`   📦 Installing dependencies...`);
        execSync('npm install --silent', { 
          cwd: task.projectDir,
          stdio: 'pipe'
        });
      } catch (e) {
        console.log(`   ⚠️ Install warning: ${e.message.slice(0, 50)}`);
      }

      // Test different strategies with REAL variations
      const strategies = agentConfig.strategies || ['conservative', 'balanced', 'aggressive'];
      
      for (const strategy of strategies) {
        const result = await this.executeTaskWithStrategy(task, strategy);
        results.push({
          task: task.task,
          type: task.type,
          strategy,
          ...result,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Save real results
    const resultsFile = `.claude-flow/training/real-results-${Date.now()}.json`;
    await fs.writeFile(resultsFile, JSON.stringify(results, null, 2));

    return results;
  }

}
