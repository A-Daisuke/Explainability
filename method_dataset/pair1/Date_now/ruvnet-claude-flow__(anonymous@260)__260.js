function __method_wrapper__() {
      spawnResults.forEach((result, index) => {
        const worker = {
          id: `worker-${index}`,
          agentId: result.agentId,
          type: workerTypes[index],
          status: 'idle',
          tasksCompleted: 0,
          currentTask: null,
          spawnedAt: Date.now(),
          performance: {
            avgTaskTime: 0,
            successRate: 1.0,
          },
        };

        workers.push(worker);
        this.state.workers.set(worker.id, worker);

        workerUpdates.push({
          type: 'worker_spawned',
          workerId: worker.id,
          workerType: worker.type,
          timestamp: worker.spawnedAt,
        });
      });

}
