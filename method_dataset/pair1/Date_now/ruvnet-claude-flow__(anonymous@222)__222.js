function __method_wrapper__() {
    test('should coordinate multiple swarms efficiently', async () => {
      const swarmCount = 10;
      const agentsPerSwarm = 5;
      const maxCoordinationTime = 15000; // 15 seconds

      const startTime = Date.now();

      // Create multiple swarms concurrently
      const swarmPromises = Array.from({ length: swarmCount }, (_, i) =>
        swarmCoordinator.initializeSwarm({
          topology: 'mesh',
          maxAgents: agentsPerSwarm,
          strategy: 'balanced',
          name: `perf-swarm-${i}`
        })
      );

      const swarmIds = await Promise.all(swarmPromises);
      const creationTime = Date.now() - startTime;

      expect(swarmIds).toHaveLength(swarmCount);
      expect(creationTime).toBeLessThan(maxCoordinationTime);

      // Verify all swarms are operational
      const statusPromises = swarmIds.map(id => swarmCoordinator.getSwarmStatus(id));
      const statuses = await Promise.all(statusPromises);

      statuses.forEach((status, index) => {
        expect(status).toBeDefined();
        expect(status.topology).toBe('mesh');
        expect(status.maxAgents).toBe(agentsPerSwarm);
      });

      // Performance cleanup
      const cleanupStart = Date.now();
      const destroyPromises = swarmIds.map(id => swarmCoordinator.destroySwarm(id));
      await Promise.all(destroyPromises);
      const cleanupTime = Date.now() - cleanupStart;

      expect(cleanupTime).toBeLessThan(5000);
      console.log(`Swarm coordination - Creation: ${creationTime}ms, Cleanup: ${cleanupTime}ms`);
    });

}
