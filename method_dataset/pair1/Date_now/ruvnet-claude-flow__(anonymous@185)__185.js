function __method_wrapper__() {
    it('should handle schema migration from NOT NULL to nullable', async () => {
      // Create .hive-mind directory
      await fs.mkdir(path.join(testDir, '.hive-mind'), { recursive: true });
      
      // Create database with incorrect schema (role NOT NULL)
      db = new Database(dbPath);
      
      db.exec(`
        CREATE TABLE IF NOT EXISTS swarms (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          objective TEXT,
          topology TEXT DEFAULT 'mesh',
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS agents (
          id TEXT PRIMARY KEY,
          swarm_id TEXT,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          role TEXT NOT NULL, -- This is the problematic constraint
          status TEXT DEFAULT 'idle',
          capabilities TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (swarm_id) REFERENCES swarms (id)
        );
      `);
      
      // Close and reopen to simulate migration scenario
      db.close();
      
      // Now run init command which should handle the existing schema
      execSync('npx claude-flow init --force', {
        cwd: testDir,
        stdio: 'pipe',
        env: { ...process.env, PATH: `/workspaces/claude-code-flow/node_modules/.bin:${process.env.PATH}` }
      });
      
      // Reopen and check if it was fixed
      db = new Database(dbPath);
      
      // The init command should have recreated or migrated the schema
      // Check if we can now insert without role
      const swarmId = 'test-swarm-' + Date.now();
      db.prepare(`
        INSERT INTO swarms (id, name, objective, topology, status)
        VALUES (?, ?, ?, ?, ?)
      `).run(swarmId, 'Test Swarm', 'Test Objective', 'mesh', 'active');
      
      const agentId = 'test-agent-' + Date.now();
      const insertAgent = () => {
        db.prepare(`
          INSERT INTO agents (id, swarm_id, name, type, status)
          VALUES (?, ?, ?, ?, ?)
        `).run(agentId, swarmId, 'Test Agent', 'worker', 'active');
      };
      
      // This should work now
      expect(insertAgent).not.toThrow();
    });

}
