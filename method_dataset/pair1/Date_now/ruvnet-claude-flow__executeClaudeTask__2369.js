function __method_wrapper__() {
  private async executeClaudeTask(
    task: TaskDefinition,
    agent: AgentState,
    prompt: string,
    targetDir: string | null,
  ): Promise<any> {
    // Create unique instance ID for this execution
    const instanceId = `swarm-${this.swarmId.id}-${task.id.id}-${Date.now()}`;

    // Build Claude arguments for non-interactive execution
    const claudeArgs = [prompt];

    // Always skip permissions for swarm automation
    claudeArgs.push('--dangerously-skip-permissions');

    // Add non-interactive flags for automation
    claudeArgs.push('-p'); // Print mode
    claudeArgs.push('--output-format', 'stream-json');
    claudeArgs.push('--verbose'); // Required when using stream-json with -p

    // Set working directory if specified
    if (targetDir) {
      // Ensure directory exists
      await Deno.mkdir(targetDir, { recursive: true });

      // Add directory context to prompt
      const enhancedPrompt = `${prompt}\n\n## Important: Working Directory\nPlease ensure all files are created in: ${targetDir}`;
      claudeArgs[0] = enhancedPrompt;
    }

    try {
      // Check if claude command exists
      const checkCommand = new Deno.Command('which', {
        args: ['claude'],
        stdout: 'piped',
        stderr: 'piped',
      });
      const checkResult = await checkCommand.output();
      if (!checkResult.success) {
        throw new Error('Claude CLI not found. Please ensure claude is installed and in PATH.');
      }

      // Execute Claude with the prompt
      const command = new Deno.Command('claude', {
        args: claudeArgs,
        cwd: targetDir || process.cwd(),
        env: {
          ...Deno.env.toObject(),
          CLAUDE_INSTANCE_ID: instanceId,
          CLAUDE_SWARM_MODE: 'true',
          CLAUDE_SWARM_ID: this.swarmId.id,
          CLAUDE_TASK_ID: task.id.id,
          CLAUDE_AGENT_ID: agent.id.id,
          CLAUDE_WORKING_DIRECTORY: targetDir || process.cwd(),
          CLAUDE_FLOW_MEMORY_ENABLED: 'true',
          CLAUDE_FLOW_MEMORY_NAMESPACE: `swarm-${this.swarmId.id}`,
        },
        stdin: 'null',
        stdout: 'piped',
        stderr: 'piped',
      });

      this.logger.info('Spawning Claude agent for task', {
        taskId: task.id.id,
        agentId: agent.id.id,
        instanceId,
        targetDir,
      });

      const child = command.spawn();
      const { code, stdout, stderr } = await child.output();

      if (code === 0) {
        const output = new TextDecoder().decode(stdout);
        this.logger.info('Claude agent completed task successfully', {
          taskId: task.id.id,
          outputLength: output.length,
        });

        return {
          success: true,
          output,
          instanceId,
          targetDir,
        };
      } else {
        const errorOutput = new TextDecoder().decode(stderr);
        this.logger.error(`Claude agent failed with code ${code}`, {
          taskId: task.id.id,
          error: errorOutput,
        });
        throw new Error(`Claude execution failed: ${errorOutput}`);
      }
    } catch (error) {
      this.logger.error('Failed to execute Claude agent', {
        taskId: task.id.id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

}
