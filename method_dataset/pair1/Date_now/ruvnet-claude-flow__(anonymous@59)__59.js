function __method_wrapper__() {
      it('should store and retrieve memory entries', async () => {
        const namespace = 'test';
        const entry = {
          key: 'test-key',
          value: { message: 'Hello World', timestamp: Date.now() },
          tags: ['test', 'example'],
          metadata: { source: 'unit-test' },
        };

        await backend.store(namespace, entry.key, entry.value, entry.tags, entry.metadata);
        const retrieved = await backend.retrieve(namespace, entry.key);

        expect(retrieved.value).toBe(entry.value);
        expect(retrieved.tags).toBe(entry.tags);
        expect(retrieved.metadata).toBe(entry.metadata);
        expect(retrieved.createdAt).toBeDefined();
        expect(retrieved.updatedAt).toBeDefined();
      });

}
