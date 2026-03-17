function __method_wrapper__() {
    test('should handle cross-swarm communication efficiently', async () => {
      // Create two swarms for communication testing
      const swarm1Id = await swarmCoordinator.initializeSwarm({
        topology: 'mesh',
        maxAgents: 3,
        strategy: 'balanced'
      });

      const swarm2Id = await swarmCoordinator.initializeSwarm({
        topology: 'hierarchical',
        maxAgents: 3,
        strategy: 'research'
      });

      const messageCount = 100;
      const maxCommunicationTime = 5000; // 5 seconds

      const startTime = Date.now();

      // Send messages between swarms
      const communicationPromises = Array.from({ length: messageCount }, (_, i) =>
        swarmCoordinator.sendMessage(swarm1Id, swarm2Id, {
          type: 'performance-test',
          index: i,
          timestamp: Date.now(),
          payload: `test-message-${i}`
        })
      );

      await Promise.all(communicationPromises);
      const communicationTime = Date.now() - startTime;

      expect(communicationTime).toBeLessThan(maxCommunicationTime);

      const messagesPerSecond = (messageCount * 1000) / communicationTime;
      console.log(`Cross-swarm communication: ${messagesPerSecond.toFixed(2)} messages/sec`);

      // Cleanup
      await swarmCoordinator.destroySwarm(swarm1Id);
      await swarmCoordinator.destroySwarm(swarm2Id);
    });

}
