function __method_wrapper__() {
    test('should handle SIGTERM gracefully', async () => {
      // Create a separate system instance for shutdown testing
      const shutdownSystem = SystemIntegration.getInstance();
      await shutdownSystem.initialize({
        logLevel: 'info',
        environment: 'shutdown-test'
      });

      expect(shutdownSystem.isReady()).toBe(true);
      
      // Start shutdown process
      const shutdownPromise = shutdownSystem.shutdown();
      
      // Should complete shutdown within reasonable time
      const startTime = Date.now();
      await shutdownPromise;
      const shutdownTime = Date.now() - startTime;
      
      expect(shutdownTime).toBeLessThan(10000); // 10 seconds max
      expect(shutdownSystem.isReady()).toBe(false);
      
      console.log(`Graceful shutdown completed in ${shutdownTime}ms`);
    });

}
