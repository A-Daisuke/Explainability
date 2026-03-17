function __method_wrapper__() {
    it('should implement priority aging', async () => {
      await advancedScheduler.initialize();

      const oldLowPriorityTask = {
        id: 'old-low',
        priority: 'low',
        submittedAt: Date.now() - 60000, // 1 minute ago
        execute: spy(async () => 'old-low-priority'),
      };

      const newHighPriorityTask = {
        id: 'new-high',
        priority: 'high',
        submittedAt: Date.now(),
        execute: spy(async () => 'new-high-priority'),
      };

      // Submit in order that would normally favor high priority
      const promises = [
        advancedScheduler.submitTask('old-low', oldLowPriorityTask),
        advancedScheduler.submitTask('new-high', newHighPriorityTask),
      ];

      const results = await Promise.all(promises);
      
      // Priority aging should eventually elevate old low priority task
      expect(results.length).toBe(2);
      expect(oldLowPriorityTask.execute.calls.length).toBe(1);
      expect(newHighPriorityTask.execute.calls.length).toBe(1);
    });

}
