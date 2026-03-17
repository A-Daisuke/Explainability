async function createSwarm(objective, config) {
  try {
    // Simulate swarm creation with progress indication
    const steps = [
      'Initializing swarm topology...',
      'Spawning Queen coordinator...',
      'Creating worker agents...',
      'Establishing communication protocols...',
      'Setting up collective memory...',
      'Activating swarm intelligence...',
    ];

    for (let i = 0; i < steps.length; i++) {
      process.stdout.write(chalk.gray(`  ${steps[i]} `));
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate work
      console.log(chalk.green('✓'));
    }

    const swarmId = `swarm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const queenId = `queen-${Date.now()}`;

    // Open database
    const dbPath = path.join(process.cwd(), '.hive-mind', 'hive.db');
    const db = new sqlite3.Database(dbPath);

    await new Promise((resolve, reject) => {
      db.serialize(() => {
        // Create swarm record
        const insertSwarm = db.prepare(`
                    INSERT INTO swarms (id, name, objective, status, queen_type, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `);

        insertSwarm.run(
          swarmId,
          `hive-${Date.now()}`,
          objective,
          'active',
          config.coordination,
          new Date().toISOString(),
          new Date().toISOString(),
        );

        // Create agents
        const insertAgent = db.prepare(`
                    INSERT INTO agents (id, swarm_id, name, type, role, status, capabilities, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `);

        // Create Queen
        insertAgent.run(
          queenId,
          swarmId,
          'Queen Coordinator',
          'coordinator',
          'queen',
          'active',
          JSON.stringify(['orchestration', 'strategy', 'coordination']),
          new Date().toISOString(),
        );

        // Create worker agents
        const workerTypes = ['researcher', 'coder', 'analyst', 'tester'];
        for (let i = 0; i < config.agents - 1; i++) {
          const agentType = workerTypes[i % workerTypes.length];
          insertAgent.run(
            `agent-${Date.now()}-${i}`,
            swarmId,
            `${agentType.charAt(0).toUpperCase() + agentType.slice(1)} Worker ${i + 1}`,
            agentType,
            'worker',
            'idle',
            JSON.stringify([agentType, 'collaboration']),
            new Date().toISOString(),
          );
        }

        insertSwarm.finalize();
        insertAgent.finalize();

        db.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });

    return { success: true, swarmId, queenId };
  } catch (error) {
    console.error('Error creating swarm:', error);
    return { success: false, error: error.message };
  }
}
