function __method_wrapper__() {
    it('should handle large data structures efficiently', () => {
      const largeData = {
        items: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          timestamp: new Date(),
          data: `item-${i}`.repeat(10)
        }))
      };
      
      const startTime = Date.now();
      const serialized = serializer.serialize(largeData);
      const deserialized = serializer.deserialize(serialized);
      const endTime = Date.now();
      
      expect(deserialized.items).toHaveLength(1000);
      expect(deserialized.items[0].timestamp).toBeInstanceOf(Date);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

}
