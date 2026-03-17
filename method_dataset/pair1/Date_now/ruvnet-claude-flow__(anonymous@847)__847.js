function __method_wrapper__() {
    it('should scale with large numbers of tasks', async () => {
      const largeBatch = Array.from({ length: 1000 }, (_, i) => ({
        id: `scale-task-${i}`,
        execute: spy(async () => `result-${i}`),
      }));

      const startTime = Date.now();
      
      const promises = largeBatch.map(task => 
        coordinationManager.submitTask(task.id, task)
      );

      const results = await Promise.all(promises);
      
      const duration = Date.now() - startTime;
      
      expect(results.length).toBe(1000);
      TestAssertions.assertInRange(duration, 0, 10000); // Should complete within 10 seconds
      
      console.log(`Large batch (1000 tasks) completed in ${duration}ms`);
    });

}
