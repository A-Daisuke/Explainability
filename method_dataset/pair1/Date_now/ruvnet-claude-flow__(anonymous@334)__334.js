function __method_wrapper__() {
    it('should handle high event throughput', () => {
      const mockHandler = jest.fn();
      eventBus.on('performance-test', mockHandler);
      
      const eventCount = 1000;
      const startTime = Date.now();
      
      for (let i = 0; i < eventCount; i++) {
        eventBus.emit('performance-test', { id: i });
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(mockHandler).toHaveBeenCalledTimes(eventCount);
      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
    });

}
