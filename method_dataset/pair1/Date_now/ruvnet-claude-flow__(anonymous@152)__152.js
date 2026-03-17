function __method_wrapper__() {
    it('should respect priority within same level', async () => {
      const sessionConfig = manager.getConfig('session');
      if (sessionConfig) {
        sessionConfig.rules.push(
          {
            toolName: 'test-tool',
            behavior: 'deny',
            scope: 'session',
            priority: 50,
            timestamp: Date.now(),
          },
          {
            toolName: 'test-tool',
            behavior: 'allow',
            scope: 'session',
            priority: 100,
            timestamp: Date.now(),
          }
        );
      }

      const query = createMockQuery({ toolName: 'test-tool' });
      const resolution = await manager.resolvePermission(query);

      expect(resolution.behavior).toBe('allow'); // Higher priority wins
    });

}
