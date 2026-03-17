function __method_wrapper__() {
    test('should maintain performance under sustained load', async () => {
      const loadDuration = 30000; // 30 seconds
      const targetRate = 10; // 10 tasks per second
      const tolerance = 0.8; // 80% of target rate

      let completedTasks = 0;
      let totalExecutionTime = 0;
      const startTime = Date.now();

      while (Date.now() - startTime < loadDuration) {
        const batchStart = Date.now();
        const batchSize = 10;

        const batchPromises = Array.from({ length: batchSize }, (_, i) =>
          taskEngine.executeTask({
            id: `sustained-task-${completedTasks + i}`,
            type: 'analysis',
            description: `Sustained load task ${completedTasks + i}`,
            priority: 'low',
            timeout: 3000
          })
        );

        const batchResults = await Promise.all(batchPromises);
        const batchTime = Date.now() - batchStart;

        completedTasks += batchResults.filter(r => r.status.match(/completed|success/)).length;
        totalExecutionTime += batchTime;

        // Control rate to avoid overwhelming the system
        const targetBatchTime = (batchSize * 1000) / targetRate;
        if (batchTime < targetBatchTime) {
          await new Promise(resolve => setTimeout(resolve, targetBatchTime - batchTime));
        }
      }

      const actualDuration = Date.now() - startTime;
      const actualRate = (completedTasks * 1000) / actualDuration;
      const avgExecutionTime = totalExecutionTime / completedTasks;

      expect(actualRate).toBeGreaterThan(targetRate * tolerance);
      expect(avgExecutionTime).toBeLessThan(5000); // Average task should complete in under 5 seconds

      console.log(`Sustained load - Rate: ${actualRate.toFixed(2)} tasks/sec, Avg time: ${avgExecutionTime.toFixed(2)}ms`);
    });

}
