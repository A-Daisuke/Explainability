function __method_wrapper__() {
    action: async (ctx: CommandContext) => {
      const subcommand = ctx.args[0];

      switch (subcommand) {
        case 'create': {
          const type = ctx.args[1] || 'general';
          const description = ctx.args.slice(2).join(' ') || 'No description';

          try {
            const persist = await getPersistence();
            const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Save to persistence directly
            await persist.saveTask({
              id: taskId,
              type,
              description,
              status: 'pending',
              priority: (ctx.flags.priority as number) || 1,
              dependencies: ctx.flags.deps ? (ctx.flags.deps as string).split(',') : [],
              metadata: {},
              progress: 0,
              createdAt: Date.now(),
            });

            success(`Task created successfully!`);
            console.log(`📝 Task ID: ${taskId}`);
            console.log(`🎯 Type: ${type}`);
            console.log(`📄 Description: ${description}`);
          } catch (err) {
            error(`Failed to create task: ${(err as Error).message}`);
          }
          break;
        }

        case 'list': {
          try {
            const persist = await getPersistence();
            const tasks = await persist.getActiveTasks();

            if (tasks.length === 0) {
              info('No active tasks');
            } else {
              success(`Active tasks (${tasks.length}):`);
              for (const task of tasks) {
                console.log(`  • ${task.id} (${task.type}) - ${task.status}`);
                if (ctx.flags.verbose) {
                  console.log(`    Description: ${task.description}`);
                }
              }
            }
          } catch (err) {
            error(`Failed to list tasks: ${(err as Error).message}`);
          }
          break;
        }

        case 'assign': {
          const taskId = ctx.args[1];
          const agentId = ctx.args[2];

          if (!taskId || !agentId) {
            error('Usage: task assign <task-id> <agent-id>');
            break;
          }

          try {
            const persist = await getPersistence();
            const tasks = await persist.getAllTasks();
            const agents = await persist.getAllAgents();

            const task = tasks.find((t) => t.id === taskId);
            const agent = agents.find((a) => a.id === agentId);

            if (!task) {
              error(`Task not found: ${taskId}`);
              break;
            }

            if (!agent) {
              error(`Agent not found: ${agentId}`);
              break;
            }

            // Update task with assigned agent
            task.assignedAgent = agentId;
            task.status = 'assigned';
            await persist.saveTask(task);

            success(`Task ${taskId} assigned to agent ${agentId}`);
            console.log(`📝 Task: ${task.description}`);
            console.log(`🤖 Agent: ${agent.name} (${agent.type})`);
          } catch (err) {
            error(`Failed to assign task: ${(err as Error).message}`);
          }
          break;
        }

        case 'workflow': {
          const workflowFile = ctx.args[1];
          if (!workflowFile) {
            error('Usage: task workflow <workflow-file>');
            break;
          }

          try {
            const { readFile } = await import('fs/promises');
            const content = await readFile(workflowFile, 'utf-8');
            const workflow = JSON.parse(content);

            success('Workflow loaded:');
            console.log(`📋 Name: ${workflow.name || 'Unnamed'}`);
            console.log(`📝 Description: ${workflow.description || 'No description'}`);
            console.log(`🤖 Agents: ${workflow.agents?.length || 0}`);
            console.log(`📌 Tasks: ${workflow.tasks?.length || 0}`);

            if (ctx.flags.execute) {
              warning('Workflow execution would start here (not yet implemented)');
              // TODO: Implement workflow execution
            } else {
              info('To execute this workflow, ensure Claude-Flow is running');
            }
          } catch (err) {
            error(`Failed to load workflow: ${(err as Error).message}`);
          }
          break;
        }

        default: {
          console.log('Available subcommands: create, list, assign, workflow');
          break;
        }
      }
    },

}
