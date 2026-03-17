function __method_wrapper__() {
    test('should enforce rate limits on agent creation', async () => {
      const rapidRequests = 20;
      const timeWindow = 1000; // 1 second
      const startTime = Date.now();
      
      const promises = Array.from({ length: rapidRequests }, (_, i) =>
        agentManager.createAgent({
          type: 'researcher',
          name: `rate-limit-test-${i}`,
          capabilities: ['research']
        }).catch(error => error)
      );

      const results = await Promise.all(promises);
      const timeElapsed = Date.now() - startTime;

      // Some requests should be rate limited
      const errors = results.filter(result => result instanceof Error);
      const successes = results.filter(result => typeof result === 'string');

      if (agentManager.hasRateLimit?.()) {
        expect(errors.length).toBeGreaterThan(0);
        errors.forEach(error => {
          expect(error.message).toMatch(/rate.limit|too.many|throttled/i);
        });
      }

      // Clean up successful creations
      for (const agentId of successes) {
        if (typeof agentId === 'string') {
          await agentManager.removeAgent(agentId);
        }
      }
    });

}
