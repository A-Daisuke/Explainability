class __C__ {
  async executeTask(task, workflow) {
    const startTime = Date.now();
    
    try {
      // Store task execution in memory if hooks enabled
      if (this.hooksEnabled) {
        await this.executeHook('notify', {
          message: `Starting task: ${task.name || task.id}`,
          sessionId: this.sessionId
        });
      }
      
      if (this.options.nonInteractive && this.options.outputFormat === 'stream-json') {
        console.log(`\n● ${task.name || task.id} - Starting Execution`);
        console.log(`  ⎿  ${task.description}`);
        console.log(`  ⎿  Agent: ${task.assignTo}`);
      } else {
        console.log(`    🔄 Executing: ${task.description}`);
      }
      
      // For demonstration/testing mode (when Claude integration is disabled)
      // we simulate successful task completion
      if (!this.options.enableClaude) {
        // Simulate variable execution time
        const executionTime = Math.min(
          1000 + Math.random() * 3000, // 1-4 seconds simulation
          task.timeout || 30000
        );
        
        await new Promise(resolve => setTimeout(resolve, executionTime));
        
        // Simulate successful completion for demo/testing
        const result = {
          success: true,
          taskId: task.id,
          duration: Date.now() - startTime,
          output: {
            status: 'completed',
            agent: task.assignTo,
            executionTime: Date.now() - startTime,
            metadata: {
              timestamp: new Date().toISOString(),
              executionId: this.executionId,
              mode: 'simulation'
            }
          }
        };
        
        // Store result in memory
        if (this.hooksEnabled) {
          await this.storeTaskResult(task.id, result.output);
        }
        
        return result;
      } else {
        // When Claude integration is enabled, delegate to actual Claude instance
        
        // Check if we have a master coordinator (interactive mode)
        const masterCoordinator = this.claudeInstances.get('master-coordinator');
        if (masterCoordinator && !this.options.nonInteractive) {
          // Interactive mode: All tasks are coordinated by the master coordinator
          console.log(`    🎯 Task delegated to Master Coordinator: ${task.description}`);
          
          // In interactive mode, the master coordinator handles all tasks
          // We just wait for the master coordinator process to complete
          const completionPromise = new Promise((resolve, reject) => {
            masterCoordinator.process.on('exit', (code) => {
              if (code === 0) {
                resolve({ success: true, code });
              } else {
                reject(new Error(`Master coordinator exited with code ${code}`));
              }
            });
            
            masterCoordinator.process.on('error', (err) => {
              reject(err);
            });
          });
          
          // For interactive mode, we use a longer timeout since user interaction is involved
          const timeout = Math.max(this.options.timeout, 1800000); // 30 minutes minimum for interactive
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Interactive session timeout')), timeout);
          });
          
          try {
            await Promise.race([completionPromise, timeoutPromise]);
            
            const result = {
              success: true,
              taskId: task.id,
              duration: Date.now() - startTime,
              output: {
                status: 'completed',
                agent: 'master-coordinator',
                executionTime: Date.now() - startTime,
                metadata: {
                  timestamp: new Date().toISOString(),
                  executionId: this.executionId,
                  mode: 'interactive-coordination'
                }
              }
            };
            
            // Store result in memory
            if (this.hooksEnabled) {
              await this.storeTaskResult(task.id, result.output);
            }
            
            return result;
            
          } catch (error) {
            throw new Error(`Task execution failed: ${error.message}`);
          }
        }
        
        // Non-interactive mode or no master coordinator: use individual Claude instances
        const claudeInstance = this.claudeInstances.get(task.assignTo);
        if (!claudeInstance) {
          // If no pre-spawned instance, create one for this task
          const agent = workflow.agents.find(a => a.id === task.assignTo);
          if (!agent) {
            throw new Error(`No agent definition found for: ${task.assignTo}`);
          }
          
          // Create task-specific prompt
          const taskPrompt = this.createTaskPrompt(task, agent, workflow);
          
          // Check if we should chain from a previous task
          let chainOptions = {};
          if (this.enableChaining && this.options.outputFormat === 'stream-json' && task.depends?.length > 0) {
            // Get the output stream from the last dependency
            const lastDependency = task.depends[task.depends.length - 1];
            const dependencyStream = this.taskOutputStreams.get(lastDependency);
            if (dependencyStream) {
              console.log(`    🔗 Enabling stream chaining from ${lastDependency} to ${task.id}`);
              chainOptions.inputStream = dependencyStream;
            }
          }
          
          // Spawn Claude instance for this specific task
          const taskClaudeProcess = await this.spawnClaudeInstance(agent, taskPrompt, chainOptions);
          
          // Store the output stream for potential chaining
          if (this.enableChaining && this.options.outputFormat === 'stream-json' && taskClaudeProcess.stdout) {
            this.taskOutputStreams.set(task.id, taskClaudeProcess.stdout);
          }
          
          // Store the instance
          this.claudeInstances.set(agent.id, {
            process: taskClaudeProcess,
            agent: agent,
            status: 'active',
            startTime: Date.now(),
            taskId: task.id
          });
          
          // Wait for task completion or timeout
          // Use longer timeout for ML tasks
          const baseTimeout = this.options.timeout || 60000;
          const isMLTask = task.type?.toLowerCase().includes('ml') || 
                          task.type?.toLowerCase().includes('model') ||
                          task.type?.toLowerCase().includes('search') ||
                          task.type?.toLowerCase().includes('analysis') ||
                          this.options.workflowType === 'ml';
          const timeout = task.timeout || (isMLTask ? Math.max(baseTimeout, 300000) : baseTimeout); // Min 5 minutes for ML tasks
          
          if (this.options.logLevel === 'debug' || this.options.verbose) {
            console.log(`    ⏱️  Timeout: ${this.formatDuration(timeout)} (Base: ${this.formatDuration(baseTimeout)}, ML Task: ${isMLTask})`);
          }
          
          const completionPromise = new Promise((resolve, reject) => {
            taskClaudeProcess.on('exit', (code) => {
              if (code === 0) {
                resolve({ success: true, code });
              } else {
                reject(new Error(`Process exited with code ${code}`));
              }
            });
            
            taskClaudeProcess.on('error', (err) => {
              reject(err);
            });
          });
          
          const timeoutPromise = new Promise((_, reject) => {
            // Use a much longer timeout for ML tasks since Claude is actively working
            const actualTimeout = isMLTask ? Math.max(timeout, 600000) : timeout; // 10 min minimum for ML
            setTimeout(() => reject(new Error('Task timeout')), actualTimeout);
          });
          
          try {
            await Promise.race([completionPromise, timeoutPromise]);
            
            const result = {
              success: true,
              taskId: task.id,
              duration: Date.now() - startTime,
              output: {
                status: 'completed',
                agent: task.assignTo,
                executionTime: Date.now() - startTime,
                metadata: {
                  timestamp: new Date().toISOString(),
                  executionId: this.executionId,
                  mode: 'claude-task-execution'
                }
              }
            };
            
            // Store result in memory
            if (this.hooksEnabled) {
              await this.storeTaskResult(task.id, result.output);
            }
            
            return result;
          } catch (error) {
            throw error;
          }
        } else {
          // Use existing Claude instance
          // In a full implementation, this would send the task to the running instance
          // For now, we'll spawn a new instance per task for simplicity
          
          const agent = claudeInstance.agent;
          const taskPrompt = this.createTaskPrompt(task, agent, workflow);
          
          // Check if we should chain from a previous task
          let chainOptions = {};
          if (this.enableChaining && this.options.outputFormat === 'stream-json' && task.depends?.length > 0) {
            // Get the output stream from the last dependency
            const lastDependency = task.depends[task.depends.length - 1];
            const dependencyStream = this.taskOutputStreams.get(lastDependency);
            if (dependencyStream) {
              console.log(`    🔗 Enabling stream chaining from ${lastDependency} to ${task.id}`);
              chainOptions.inputStream = dependencyStream;
            }
          }
          
          // For now, spawn a new instance for each task
          const taskClaudeProcess = await this.spawnClaudeInstance(agent, taskPrompt, chainOptions);
          
          // Store the output stream for potential chaining
          if (this.enableChaining && this.options.outputFormat === 'stream-json' && taskClaudeProcess.stdout) {
            this.taskOutputStreams.set(task.id, taskClaudeProcess.stdout);
          }
          
          // Wait for completion
          // Use longer timeout for ML tasks
          const baseTimeout = this.options.timeout || 60000;
          const isMLTask = task.type?.toLowerCase().includes('ml') || 
                          task.type?.toLowerCase().includes('model') ||
                          task.type?.toLowerCase().includes('search') ||
                          task.type?.toLowerCase().includes('analysis') ||
                          this.options.workflowType === 'ml';
          const timeout = task.timeout || (isMLTask ? Math.max(baseTimeout, 300000) : baseTimeout); // Min 5 minutes for ML tasks
          
          if (this.options.logLevel === 'debug' || this.options.verbose) {
            console.log(`    ⏱️  Timeout: ${this.formatDuration(timeout)} (Base: ${this.formatDuration(baseTimeout)}, ML Task: ${isMLTask})`);
          }
          
          const completionPromise = new Promise((resolve, reject) => {
            taskClaudeProcess.on('exit', (code) => {
              if (code === 0) {
                resolve({ success: true, code });
              } else {
                reject(new Error(`Process exited with code ${code}`));
              }
            });
            
            taskClaudeProcess.on('error', (err) => {
              reject(err);
            });
          });
          
          const timeoutPromise = new Promise((_, reject) => {
            // Use a much longer timeout for ML tasks since Claude is actively working
            const actualTimeout = isMLTask ? Math.max(timeout, 600000) : timeout; // 10 min minimum for ML
            setTimeout(() => reject(new Error('Task timeout')), actualTimeout);
          });
          
          try {
            await Promise.race([completionPromise, timeoutPromise]);
            
            const result = {
              success: true,
              taskId: task.id,
              duration: Date.now() - startTime,
              output: {
                status: 'completed',
                agent: task.assignTo,
                executionTime: Date.now() - startTime,
                metadata: {
                  timestamp: new Date().toISOString(),
                  executionId: this.executionId,
                  mode: 'claude-task-execution'
                }
              }
            };
            
            // Store result in memory
            if (this.hooksEnabled) {
              await this.storeTaskResult(task.id, result.output);
            }
            
            return result;
          } catch (error) {
            throw error;
          }
        }
      }
      
    } catch (error) {
      return {
        success: false,
        taskId: task.id,
        duration: Date.now() - startTime,
        error: error
      };
    }
  }

}
