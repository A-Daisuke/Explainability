  async function handleTaskCommand(args, state) {
    const subCmd = args[0];
    switch (subCmd) {
      case 'create':
        const type = args[1] || 'general';
        const description = args.slice(2).join(' ') || 'No description';
        const task = {
          id: `task-${Date.now()}`,
          type,
          description,
          status: 'pending',
          created: new Date().toISOString(),
        };
        state.context.tasks.push(task);
        printSuccess(`Created task: ${task.id}`);
        console.log(`  Type: ${type}`);
        console.log(`  Description: ${description}`);
        break;

      case 'list':
        if (state.context.tasks.length === 0) {
          console.log('No active tasks');
        } else {
          console.log('Active tasks:');
          state.context.tasks.forEach((task) => {
            console.log(`  ${task.id} - ${task.type} - ${task.status}`);
            console.log(`    ${task.description}`);
          });
        }
        break;

      case 'assign':
        const taskId = args[1];
        const assignAgentId = args[2];
        const foundTask = state.context.tasks.find((t) => t.id === taskId);
        const assignAgent = state.context.agents.find(
          (a) => a.id === assignAgentId || a.name === assignAgentId,
        );

        if (foundTask && assignAgent) {
          foundTask.assignedTo = assignAgent.id;
          foundTask.status = 'assigned';
          printSuccess(`Assigned task ${taskId} to agent ${assignAgent.name}`);
        } else {
          printError('Task or agent not found');
        }
        break;

      case 'status':
        const statusId = args[1];
        const statusTask = state.context.tasks.find((t) => t.id === statusId);
        if (statusTask) {
          console.log(`Task: ${statusTask.id}`);
          console.log(`  Type: ${statusTask.type}`);
          console.log(`  Status: ${statusTask.status}`);
          console.log(`  Description: ${statusTask.description}`);
          if (statusTask.assignedTo) {
            console.log(`  Assigned to: ${statusTask.assignedTo}`);
          }
          console.log(`  Created: ${statusTask.created}`);
        } else {
          printError(`Task not found: ${statusId}`);
        }
        break;

      default:
        console.log('Task commands: create, list, assign, status');
    }
  }
