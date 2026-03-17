class __C__ {
  async executeWorkflow(workflowData, variables = {}) {
    try {
      // Store workflow for reference
      this.currentWorkflow = workflowData;
      
      if (this.options.logLevel === 'quiet') {
        console.log(`🚀 Executing workflow: ${this.executionId}`);
      } else {
        console.log(`🚀 Starting workflow execution: ${this.executionId}`);
        console.log(`📋 Workflow: ${workflowData.name}`);
        console.log(`🎯 Strategy: MLE-STAR Machine Learning Engineering`);
        
        if (this.options.enableClaude) {
          console.log(`🤖 Claude CLI Integration: Enabled`);
        }
        
        if (this.options.nonInteractive) {
          console.log(`🖥️  Non-Interactive Mode: Enabled`);
          if (this.options.outputFormat === 'stream-json') {
            console.log();
            console.log('● Running MLE-STAR workflow with Claude CLI integration');
            console.log('  ⎿  Command format: claude --print --output-format stream-json --verbose --dangerously-skip-permissions');
            console.log('  ⎿  Each agent will show real-time stream output below');
            console.log('  ⎿  Interactive-style formatting enabled');
          }
        }
      }
      
      console.log();

      // Pre-execution hooks
      if (this.hooksEnabled) {
        await this.executeHook('pre-task', {
          description: `Execute workflow: ${workflowData.name}`,
          sessionId: this.sessionId
        });
      }

      // Validate workflow
      this.validateWorkflow(workflowData);
      
      // Apply variable substitutions
      const processedWorkflow = this.applyVariables(workflowData, variables);
      
      // Initialize agents if Claude integration is enabled
      if (this.options.enableClaude) {
        await this.initializeClaudeAgents(processedWorkflow.agents);
      }
      
      // Execute workflow phases
      const result = await this.executeWorkflowTasks(processedWorkflow);
      
      // Post-execution hooks
      if (this.hooksEnabled) {
        await this.executeHook('post-task', {
          taskId: this.executionId,
          sessionId: this.sessionId,
          result: result.success ? 'success' : 'failure'
        });
      }
      
      const duration = Date.now() - this.startTime;
      
      if (result.success) {
        printSuccess(`✅ Workflow completed successfully in ${this.formatDuration(duration)}`);
        console.log(`📊 Tasks: ${result.completedTasks}/${result.totalTasks} completed`);
        console.log(`🆔 Execution ID: ${this.executionId}`);
      } else {
        printError(`❌ Workflow failed after ${this.formatDuration(duration)}`);
        console.log(`📊 Tasks: ${result.completedTasks}/${result.totalTasks} completed`);
        console.log(`❌ Errors: ${this.errors.length}`);
      }
      
      // Cleanup Claude instances
      if (this.options.enableClaude) {
        await this.cleanupClaudeInstances();
      }
      
      return result;
      
    } catch (error) {
      printError(`Workflow execution failed: ${error.message}`);
      await this.cleanupClaudeInstances();
      throw error;
    }
  }

}
