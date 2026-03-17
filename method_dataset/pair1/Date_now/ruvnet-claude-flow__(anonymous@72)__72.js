function __method_wrapper__() {
    it('should allow inserting agents without role value', async () => {
      // Run init command
      execSync('npx claude-flow init', {
        cwd: testDir,
        stdio: 'pipe',
        env: { ...process.env, PATH: `/workspaces/claude-code-flow/node_modules/.bin:${process.env.PATH}` }
      });

      // Open database
      db = new Database(dbPath);
      
      // First, create a swarm (required for foreign key)
      const swarmId = 'test-swarm-' + Date.now();
      db.prepare(`
        INSERT INTO swarms (id, name, objective, topology, status)
        VALUES (?, ?, ?, ?, ?)
      `).run(swarmId, 'Test Swarm', 'Test Objective', 'mesh', 'active');
      
      // Try to insert agent without role - this should NOT fail
      const agentId = 'test-agent-' + Date.now();
      const insertAgent = () => {
        db.prepare(`
          INSERT INTO agents (id, swarm_id, name, type, status)
          VALUES (?, ?, ?, ?, ?)
        `).run(agentId, swarmId, 'Test Agent', 'worker', 'active');
      };
      
      // This should not throw an error
      expect(insertAgent).not.toThrow();
      
      // Verify agent was inserted
      const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId);
      expect(agent).toBeDefined();
      expect(agent.id).toBe(agentId);
      expect(agent.role).toBeNull(); // Role should be NULL when not provided
    });

}
