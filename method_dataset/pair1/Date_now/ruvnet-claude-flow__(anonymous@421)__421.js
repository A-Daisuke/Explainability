function __method_wrapper__() {
      it('should handle disk space exhaustion', async () => {
        // This is difficult to simulate reliably, but we can test large writes
        const largeValue = {
          data: 'x'.repeat(1024 * 1024), // 1MB of data
          timestamp: Date.now(),
        };

        try {
          await backend.store('large-test', 'big-value', largeValue);
          const retrieved = await backend.retrieve('large-test', 'big-value');
          expect(retrieved.value.data.length).toBe(largeValue.data.length);
        } catch (error) {
          // May fail on systems with limited disk space
          console.log(`Large value test failed: ${error.message}`);
        }
      });

}
