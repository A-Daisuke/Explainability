function __method_wrapper__() {
    test('should handle concurrent task execution', async () => {
      const concurrentTasks = [
        'concurrent-task-1',
        'concurrent-task-2', 
        'concurrent-task-3'
      ].map(id => ({
        id,
        description: `Concurrent task ${id}`,
        requiredCapabilities: ['implement'],
        expectedDuration: 60000,
        verificationCriteria: {
          requiresTests: false,
          requiresCodeReview: false,
          requiresBuild: false,
          minTruthScore: 0.6,
          crossVerificationRequired: false
        }
      }));

      // Add concurrent tasks to config
      config.tasks.push(...concurrentTasks);
      await pipeline.updateConfig(config);

      // Execute tasks concurrently
      const startTime = Date.now();
      const resultPromises = concurrentTasks.map(task => 
        pipeline.executeTask(task.id)
      );

      const results = await Promise.all(resultPromises);
      const totalDuration = Date.now() - startTime;

      // Verify all tasks completed
      expect(results.every(r => r.status === 'completed')).toBe(true);

      // Verify concurrent execution was efficient (not sequential)
      const sequentialDuration = concurrentTasks.length * 60000;
      expect(totalDuration).toBeLessThan(sequentialDuration * 0.7);

      // Verify no resource conflicts occurred
      const hasResourceConflicts = results.some(r => 
        r.errors.some(e => e.includes('resource conflict'))
      );
      expect(hasResourceConflicts).toBe(false);
    }, 30000);

}
