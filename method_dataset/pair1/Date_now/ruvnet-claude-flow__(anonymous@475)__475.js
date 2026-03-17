function __method_wrapper__() {
    it('should support resource sharing', async () => {
      const sharedResource = 'shared-resource';
      
      const tasks = Array.from({ length: 3 }, (_, i) => ({
        id: `shared-task-${i}`,
        requiredResources: [sharedResource],
        resourceMode: 'shared',
        execute: spy(async () => {
          await AsyncTestUtils.delay(50);
          return `shared-${i}`;
        }),
      }));

      const startTime = Date.now();
      
      const promises = tasks.map(task => 
        coordinationManager.submitTask(task.id, task)
      );

      await Promise.all(promises);
      
      const duration = Date.now() - startTime;
      
      // Should complete faster than serialized execution (less than 150ms vs 150ms+)
      TestAssertions.assertInRange(duration, 0, 120);
    });

}
