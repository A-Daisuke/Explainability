function __method_wrapper__() {
    it('should handle many concurrent requests without crashing', async () => {
      const { batchInitCommand } = await import('../../src/cli/simple-commands/init/batch-init.js');

      // Create many projects to test resource limits
      const manyProjects = Array.from({ length: 100 }, (_, i) => `dos-test-${i}`);

      const startTime = Date.now();

      await expect(batchInitCommand(manyProjects, {
        maxConcurrency: 10,
        progressTracking: false,
        performanceMonitoring: false,
      })).resolves.not.toThrow();

      const endTime = Date.now();

      // Should complete in reasonable time (not hang)
      expect(endTime - startTime).toBeLessThan(120000); // 2 minutes max
    });

}
