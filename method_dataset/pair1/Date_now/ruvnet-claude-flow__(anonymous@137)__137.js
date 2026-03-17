function __method_wrapper__() {
    test('should handle 1000 memory operations per second', async () => {
      const operationsPerSecond = 1000;
      const testDuration = 5000; // 5 seconds
      const expectedOperations = (operationsPerSecond * testDuration) / 1000;

      let operationCount = 0;
      const startTime = Date.now();
      const operations: Promise<void>[] = [];

      while (Date.now() - startTime < testDuration) {
        const operation = (async () => {
          const key = `perf-${operationCount++}-${Date.now()}`;
          const data = { 
            index: operationCount,
            timestamp: Date.now(),
            payload: 'x'.repeat(100) // 100 char payload
          };

          await memoryManager.store(key, data, 'performance-test');
          const retrieved = await memoryManager.retrieve(key, 'performance-test');
          expect(retrieved).toEqual(data);
          await memoryManager.delete(key, 'performance-test');
        })();

        operations.push(operation);

        // Control operation rate
        if (operations.length >= 100) {
          await Promise.all(operations.splice(0, 50));
        }
      }

      // Wait for remaining operations
      await Promise.all(operations);

      const actualDuration = Date.now() - startTime;
      const actualRate = (operationCount * 1000) / actualDuration;

      expect(actualRate).toBeGreaterThan(operationsPerSecond * 0.8); // Allow 20% deviation
      console.log(`Memory operations rate: ${actualRate.toFixed(2)} ops/sec`);
    });

}
