function __method_wrapper__() {
    test('should handle large data objects efficiently', async () => {
      const largeDataSizes = [1024, 10240, 102400, 1024000]; // 1KB, 10KB, 100KB, 1MB
      const maxTime = 1000; // 1 second per operation

      for (const size of largeDataSizes) {
        const key = `large-data-${size}`;
        const data = {
          size,
          payload: 'x'.repeat(size),
          metadata: {
            created: Date.now(),
            type: 'performance-test'
          }
        };

        const startTime = Date.now();
        
        await memoryManager.store(key, data, 'performance-test');
        const storeTime = Date.now() - startTime;

        const retrieveStart = Date.now();
        const retrieved = await memoryManager.retrieve(key, 'performance-test');
        const retrieveTime = Date.now() - retrieveStart;

        const deleteStart = Date.now();
        await memoryManager.delete(key, 'performance-test');
        const deleteTime = Date.now() - deleteStart;

        // Verify data integrity
        expect(retrieved.size).toBe(size);
        expect(retrieved.payload).toBe(data.payload);

        // Performance requirements
        expect(storeTime).toBeLessThan(maxTime);
        expect(retrieveTime).toBeLessThan(maxTime);
        expect(deleteTime).toBeLessThan(maxTime / 2); // Delete should be faster

        console.log(`${size} bytes - Store: ${storeTime}ms, Retrieve: ${retrieveTime}ms, Delete: ${deleteTime}ms`);
      }
    });

}
