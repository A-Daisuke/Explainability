function __method_wrapper__() {
    it('should allow inserting agents with role value', async () => {
      // Run init command
      execSync('npx claude-flow init', {
        cwd: testDir,
        stdio: 'pipe',
        env: { ...process.env, PATH: `/workspaces/claude-code-flow/node_modules/.bin:${process.env.PATH}` }
      });

      // Open database
      db = new Database(dbPath);
      
      // Create a swarm
      const swarmId = 'test-swarm-' + Date.now();
      db.prepare(`
        INSERT INTO swarms (id, name, objective, topology, status)
        VALUES (?, ?, ?, ?, ?)
      `).run(swarmId, 'Test Swarm', 'Test Objective', 'mesh', 'active');
      
      // Insert agent with role
      const agentId = 'test-agent-' + Date.now();
      db.prepare(`
        INSERT INTO agents (id, swarm_id, name, type, role, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(agentId, swarmId, 'Test Agent', 'coordinator', 'leader', 'active');
      
      // Verify agent was inserted with role
      const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId);
      expect(agent).toBeDefined();
      expect(agent.id).toBe(agentId);
      expect(agent.role).toBe('leader');
    });

}
