    const executionInterval = setInterval(async () => {
      try {
        // Check if objective is still executing
        if (objective.status !== 'executing') {
          clearInterval(executionInterval);
          return;
        }

        // Find queued tasks
        const queuedTasks = Array.from(this.tasks.values()).filter(
          (task) => task.context?.objectiveId === objective.id && task.status === 'queued',
        );

        // Find idle agents
        const idleAgents = Array.from(this.agents.values()).filter(
          (agent) => agent.status === 'idle',
        );

        if (queuedTasks.length > 0 && idleAgents.length > 0) {
          this.logger.debug('Processing queued tasks', {
            queuedTasks: queuedTasks.length,
            idleAgents: idleAgents.length,
          });
        }

        // Assign tasks to idle agents
        for (const task of queuedTasks) {
          if (idleAgents.length === 0) break;

          // Find suitable agent
          const suitableAgents = idleAgents.filter((agent) => this.agentCanHandleTask(agent, task));

          if (suitableAgents.length > 0) {
            // Assign to first suitable agent
            await this.assignTask(task.id.id, suitableAgents[0].id.id);

            // Remove agent from idle list
            const agentIndex = idleAgents.findIndex((a) => a.id.id === suitableAgents[0].id.id);
            if (agentIndex >= 0) {
              idleAgents.splice(agentIndex, 1);
            }
          }
        }

        // Check for completed tasks and process dependencies
        const completedTasks = Array.from(this.tasks.values()).filter(
          (task) => task.context?.objectiveId === objective.id && task.status === 'completed',
        );

        // Find tasks that can now be queued (dependencies met)
        const pendingTasks = Array.from(this.tasks.values()).filter(
          (task) =>
            task.context?.objectiveId === objective.id &&
            task.status === 'created' &&
            this.taskDependenciesMet(task, completedTasks),
        );

        // Queue tasks with met dependencies
        for (const task of pendingTasks) {
          task.status = 'queued';
          task.updatedAt = new Date();

          task.statusHistory.push({
            timestamp: new Date(),
            from: 'created' as TaskStatus,
            to: 'queued' as TaskStatus,
            reason: 'Dependencies met, task queued',
            triggeredBy: 'system',
          });

          this.emitSwarmEvent({
            id: generateId('event'),
            timestamp: new Date(),
            type: 'task.queued',
            source: this.swarmId.id,
            data: { task },
            broadcast: false,
            processed: false,
          });
        }

        // Check for stuck/timed out tasks
        const runningTasks = Array.from(this.tasks.values()).filter(
          (task) => task.context?.objectiveId === objective.id && task.status === 'running',
        );

        const now = Date.now();
        for (const task of runningTasks) {
          if (task.startedAt) {
            const runtime = now - task.startedAt.getTime();
            const timeout = task.constraints?.timeoutAfter || SWARM_CONSTANTS.DEFAULT_TASK_TIMEOUT;

            if (runtime > timeout) {
              this.logger.warn('Task timed out', {
                taskId: task.id.id,
                runtime: Math.round(runtime / 1000),
                timeout: Math.round(timeout / 1000),
              });

              // Mark task as failed due to timeout
              task.status = 'failed';
              task.completedAt = new Date();
              task.error = {
                type: 'TimeoutError',
                message: `Task exceeded timeout of ${timeout}ms`,
                code: 'TASK_TIMEOUT',
                context: { taskId: task.id.id, runtime },
                recoverable: true,
                retryable: true,
              };

              // Update agent state if assigned
              if (task.assignedTo) {
                const agent = this.agents.get(task.assignedTo.id);
                if (agent) {
                  agent.status = 'idle';
                  agent.currentTask = undefined;
                  agent.metrics.tasksFailed++;
                }
              }

              // Emit timeout event
              this.emitSwarmEvent({
                id: generateId('event'),
                timestamp: new Date(),
                type: 'task.failed',
                source: this.swarmId.id,
                data: { task, reason: 'timeout' },
                broadcast: false,
                processed: false,
              });
            }
          }
        }

        // Update objective progress
        const allTasks = Array.from(this.tasks.values()).filter(
          (task) => task.context?.objectiveId === objective.id,
        );

        objective.progress.totalTasks = allTasks.length;
        objective.progress.completedTasks = allTasks.filter((t) => t.status === 'completed').length;
        objective.progress.failedTasks = allTasks.filter((t) => t.status === 'failed').length;
        objective.progress.runningTasks = allTasks.filter((t) => t.status === 'running').length;
        objective.progress.percentComplete =
          objective.progress.totalTasks > 0
            ? (objective.progress.completedTasks / objective.progress.totalTasks) * 100
            : 0;

        // Check if objective is complete
        if (
          objective.progress.completedTasks + objective.progress.failedTasks ===
          objective.progress.totalTasks
        ) {
          objective.status = objective.progress.failedTasks === 0 ? 'completed' : 'failed';
          objective.completedAt = new Date();
          clearInterval(executionInterval);

          this.logger.info('Objective completed', {
            objectiveId: objective.id,
            status: objective.status,
            completedTasks: objective.progress.completedTasks,
            failedTasks: objective.progress.failedTasks,
          });

          this.emitSwarmEvent({
            id: generateId('event'),
            timestamp: new Date(),
            type: objective.status === 'completed' ? 'objective.completed' : 'objective.failed',
            source: this.swarmId.id,
            data: { objective },
            broadcast: true,
            processed: false,
          });
        }
      } catch (error) {
        this.logger.error('Error in task execution loop', { error });
      }
    }, 2000); // Check every 2 seconds
