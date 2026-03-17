function __method_wrapper__() {
  private async executeAgent(task: AgentTask): Promise<void> {
    const startTime = Date.now();
    console.log(`📋 Starting ${task.name} agent (mode: ${task.mode})...`);

    try {
      const command = `npx claude-flow sparc run ${task.mode} "${task.task}"`;
      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        timeout: 300000 // 5 minute timeout
      });

      const duration = Date.now() - startTime;
      
      this.results.push({
        agent: task.name,
        success: true,
        output: stdout,
        duration
      });

      console.log(`✅ ${task.name} completed in ${duration}ms`);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      this.results.push({
        agent: task.name,
        success: false,
        error: error.message || String(error),
        duration
      });

      console.error(`❌ ${task.name} failed after ${duration}ms:`, error.message);
    }
  }

}
