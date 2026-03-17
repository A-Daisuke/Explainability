      const concurrentOperations = Array.from({ length: concurrency }, async (_, agentIndex) => {
        const agentId = await agentManager.createAgent({
          type: 'researcher',
          name: `concurrent-agent-${agentIndex}`,
          capabilities: ['research']
        });

        const operationTimes: number[] = [];

        for (let i = 0; i < operationsPerAgent; i++) {
          const opStart = Date.now();
          
          // Mix of operations
          if (i % 3 === 0) {
            await agentManager.getAgent(agentId);
          } else if (i % 3 === 1) {
            await agentManager.updateAgent(agentId, {
              name: `concurrent-agent-${agentIndex}-updated-${i}`
            });
          } else {
            await agentManager.getAgentStatus(agentId);
          }
          
          operationTimes.push(Date.now() - opStart);
        }

        // Clean up
        await agentManager.removeAgent(agentId);

        return operationTimes;
      });
