function __method_wrapper__() {
    test('should show swarm status', async () => {
      const mockSwarmData = {
        id: 'swarm-123',
        objective: 'Build API',
        status: 'active',
        topology: 'hierarchical',
        agents: [
          { id: 'agent-1', type: 'researcher', status: 'active' },
          { id: 'agent-2', type: 'coder', status: 'working' },
        ],
        metrics: {
          startTime: new Date(Date.now() - 300000).toISOString(),
          tasksCompleted: 15,
          tasksInProgress: 3,
          tasksPending: 7,
        },
      };

      fs.pathExists.mockResolvedValue(true);
      fs.readJson.mockResolvedValue(mockSwarmData);

      await swarmCommand(['status'], {});

      const output = consoleLogSpy.mock.calls.flat().join('\n');
      expect(output).toContain('Swarm Status');
      expect(output).toContain('Build API');
      expect(output).toContain('active');
      expect(output).toContain('hierarchical');
      expect(output).toContain('2 agents');
      expect(output).toContain('15 completed');
    });

}
