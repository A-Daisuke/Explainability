function __method_wrapper__() {
    it('should detect performance degradation', async () => {
      // Create a scenario that causes performance degradation
      const slowTasks = Array.from({ length: 20 }, (_, i) => ({
        id: `slow-task-${i}`,
        execute: spy(async () => {
          await AsyncTestUtils.delay(200 + i * 10); // Progressively slower
          return `slow-${i}`;
        }),
      }));

      const startTime = Date.now();
      
      await Promise.all(
        slowTasks.map(task => coordinationManager.submitTask(task.id, task))
      );

      const endTime = Date.now();
      const totalDuration = endTime - startTime;

      const performanceMetrics = await coordinationManager.getPerformanceMetrics();
      
      expect(performanceMetrics).toBeDefined();
      expect(typeof performanceMetrics.throughput).toBe('number');
      expect(typeof performanceMetrics.latency).toBe('object');
      
      // Should detect degradation in throughput
      TestAssertions.assertInRange(performanceMetrics.throughput, 0.01, 1.0); // tasks per ms
    });

}
