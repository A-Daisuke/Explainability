function __method_wrapper__() {
    test('should create 100 agents in under 10 seconds', async () => {
      const agentCount = 100;
      const maxTime = 10000; // 10 seconds
      const startTime = Date.now();

      const createPromises = Array.from({ length: agentCount }, (_, i) =>
        agentManager.createAgent({
          type: 'researcher',
          name: `perf-agent-${i}`,
          capabilities: ['research', 'analysis']
        })
      );

      const agentIds = await Promise.all(createPromises);
      const creationTime = Date.now() - startTime;

      expect(agentIds).toHaveLength(agentCount);
      expect(creationTime).toBeLessThan(maxTime);

      console.log(`Created ${agentCount} agents in ${creationTime}ms (${creationTime/agentCount}ms per agent)`);

      // Performance cleanup
      const cleanupStart = Date.now();
      const removePromises = agentIds.map(id => agentManager.removeAgent(id));
      await Promise.all(removePromises);
      const cleanupTime = Date.now() - cleanupStart;

      expect(cleanupTime).toBeLessThan(5000); // 5 seconds for cleanup
      console.log(`Cleaned up ${agentCount} agents in ${cleanupTime}ms`);
    });

}
