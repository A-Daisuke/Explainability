function __method_wrapper__() {
  private async executeInteractiveCLI(
    task: TaskDefinition,
    agent: AgentState
  ): Promise<ExecutionResult> {
    const startTime = Date.now();

    return new Promise((resolve) => {
      const args = ['--no-visual', task.description];
      const claudeProcess = spawn('claude', args, {
        stdio: 'pipe',
        env: { ...process.env }
      });

      let output = '';
      let errorOutput = '';

      claudeProcess.stdout?.on('data', (data) => {
        output += data.toString();
      });

      claudeProcess.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      claudeProcess.on('close', (code) => {
        const executionTime = Date.now() - startTime;
        resolve({
          success: code === 0,
          output: output || errorOutput,
          errors: code !== 0 ? [errorOutput] : [],
          executionTime,
          tokensUsed: 0
        });
      });

      claudeProcess.on('error', (error) => {
        const executionTime = Date.now() - startTime;
        resolve({
          success: false,
          output: null,
          errors: [error.message],
          executionTime,
          tokensUsed: 0
        });
      });
    });
  }

}
