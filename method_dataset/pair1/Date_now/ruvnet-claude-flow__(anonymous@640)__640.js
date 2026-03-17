function __method_wrapper__() {
    test('should maintain performance under load', async () => {
      // Create many small tasks
      const loadTasks = Array.from({ length: 20 }, (_, i) => ({
        id: `load-task-${i}`,
        description: `Load test task ${i}`,
        requiredCapabilities: ['implement'],
        expectedDuration: 10000, // 10 seconds each
        verificationCriteria: {
          requiresTests: false,
          requiresCodeReview: false,
          requiresBuild: false,
          minTruthScore: 0.5,
          crossVerificationRequired: false
        }
      }));

      config.tasks.push(...loadTasks);
      await pipeline.updateConfig(config);

      // Monitor performance metrics during load test
      const performanceMetrics = await pipeline.startPerformanceMonitoring();

      const startTime = Date.now();
      
      // Execute in batches to simulate realistic load
      const batchSize = 5;
      const batches = [];
      for (let i = 0; i < loadTasks.length; i += batchSize) {
        const batch = loadTasks.slice(i, i + batchSize);
        batches.push(
          Promise.all(batch.map(task => pipeline.executeTask(task.id)))
        );
      }

      const allResults = await Promise.all(batches);
      const flatResults = allResults.flat();
      const totalDuration = Date.now() - startTime;

      await pipeline.stopPerformanceMonitoring();

      // Verify load handling
      expect(flatResults.every(r => r.status === 'completed')).toBe(true);
      expect(totalDuration).toBeLessThan(120000); // Should complete within 2 minutes

      // Verify performance didn't degrade significantly
      expect(performanceMetrics.averageResponseTime).toBeLessThan(15000);
      expect(performanceMetrics.memoryUsage.peak).toBeLessThan(500 * 1024 * 1024); // 500MB
      expect(performanceMetrics.errorRate).toBeLessThan(0.05); // Less than 5% errors
    }, 60000);

}
