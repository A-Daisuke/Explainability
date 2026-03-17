      const phasePromises = phaseTasks.map(async (task) => {
        const taskStatus = taskStatuses.get(task.id);
        
        try {
          // Show task starting
          console.log(`\n  🚀 Starting: ${task.name || task.id}`);
          console.log(`     Agent: ${task.assignTo}`);
          console.log(`     Description: ${task.description?.substring(0, 80)}...`);
          
          const result = await this.executeTask(task, workflow);
          
          taskStatus.status = result.success ? 'completed' : 'failed';
          taskStatus.endTime = Date.now();
          taskStatus.summary = result.success ? 
            `✅ Completed in ${this.formatDuration(result.duration)}` :
            `❌ Failed: ${result.error?.message || 'Unknown error'}`;
          
          return result;
        } catch (error) {
          taskStatus.status = 'failed';
          taskStatus.endTime = Date.now();
          taskStatus.summary = `❌ Error: ${error.message}`;
          throw error;
        }
      });
