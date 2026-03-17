async function spawnSwarm(args, flags) {
  const objective = args.join(' ').trim();

  // Check for non-interactive mode FIRST
  const isNonInteractive = flags['non-interactive'] || flags.nonInteractive;
  
  if (!objective && !flags.wizard) {
    if (isNonInteractive) {
      console.error(chalk.red('Error: Objective required in non-interactive mode'));
      console.log('Usage: claude-flow hive-mind spawn "Your objective" --non-interactive');
    } else {
      console.error(chalk.red('Error: Please provide an objective or use --wizard flag'));
      console.log('Example: claude-flow hive-mind spawn "Build REST API"');
    }
    return;
  }
  
  // Log non-interactive mode status
  if (isNonInteractive && flags.verbose) {
    console.log(chalk.cyan('🤖 Running in non-interactive mode'));
  }

  // Validate parameters
  if (flags.verbose) {
    console.log(chalk.gray('🔍 Debug: Parsed flags:'));
    console.log(chalk.gray(JSON.stringify(flags, null, 2)));
  }

  // Validate queen type
  const validQueenTypes = ['strategic', 'tactical', 'adaptive'];
  const queenType = flags.queenType || flags['queen-type'] || 'strategic';
  if (!validQueenTypes.includes(queenType)) {
    console.error(chalk.red(`Error: Invalid queen type '${queenType}'. Must be one of: ${validQueenTypes.join(', ')}`));
    return;
  }

  // Validate max workers
  const maxWorkers = parseInt(flags.maxWorkers || flags['max-workers'] || '8');
  if (isNaN(maxWorkers) || maxWorkers < 1 || maxWorkers > 20) {
    console.error(chalk.red('Error: max-workers must be a number between 1 and 20'));
    return;
  }

  // Validate consensus algorithm
  const validConsensusTypes = ['majority', 'weighted', 'byzantine'];
  const consensusAlgorithm = flags.consensus || flags.consensusAlgorithm || 'majority';
  if (!validConsensusTypes.includes(consensusAlgorithm)) {
    console.error(chalk.red(`Error: Invalid consensus algorithm '${consensusAlgorithm}'. Must be one of: ${validConsensusTypes.join(', ')}`));
    return;
  }

  const spinner = ora('Spawning Hive Mind swarm...').start();

  try {
    // Initialize hive mind core with error handling
    let hiveMind;
    try {
      spinner.text = 'Initializing Hive Mind Core...';
      hiveMind = new HiveMindCore({
        objective,
        name: flags.name || `hive-${Date.now()}`,
        queenType: flags.queenType || flags['queen-type'] || 'strategic',
        maxWorkers: parseInt(flags.maxWorkers || flags['max-workers'] || '8'),
        consensusAlgorithm: flags.consensus || flags.consensusAlgorithm || 'majority',
        autoScale: flags.autoScale !== undefined ? flags.autoScale : (flags['auto-scale'] !== undefined ? flags['auto-scale'] : true),
        namespace: flags.namespace || 'default',
        encryption: flags.encryption || false,
      });
    } catch (error) {
      console.error('HiveMindCore initialization failed:', error);
      throw new Error(`Failed to initialize HiveMindCore: ${error.message}`);
    }

    spinner.text = 'Setting up database connection...';
    // Initialize database connection
    const dbDir = path.join(cwd(), '.hive-mind');
    const dbPath = path.join(dbDir, 'hive.db');

    // Ensure .hive-mind directory exists
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
    }

    // Check if database file exists and try to create a clean one if needed
    let db;
    try {
      spinner.text = 'Creating database connection...';
      db = new Database(dbPath);
      // Test the database with a simple query
      db.prepare('SELECT 1').get();
      spinner.text = 'Database connection established';
    } catch (error) {
      console.warn('Database issue detected, recreating...', error.message);
      spinner.text = 'Recreating database...';
      // Remove corrupted database
      if (existsSync(dbPath)) {
        try {
          const fs = await import('fs');
          fs.unlinkSync(dbPath);
        } catch (e) {
          console.warn('Could not remove corrupted database:', e.message);
        }
      }
      // Create new database
      db = new Database(dbPath);
    }

    // Initialize database schema if not exists
    spinner.text = 'Creating database schema...';
    try {
      db.exec(`
      CREATE TABLE IF NOT EXISTS swarms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        objective TEXT,
        queen_type TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME
      );
      
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        swarm_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT DEFAULT 'idle',
        capabilities TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (swarm_id) REFERENCES swarms(id)
      );
      
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        swarm_id TEXT NOT NULL,
        agent_id TEXT,
        description TEXT,
        status TEXT DEFAULT 'pending',
        priority INTEGER DEFAULT 5,
        result TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY (swarm_id) REFERENCES swarms(id),
        FOREIGN KEY (agent_id) REFERENCES agents(id)
      );
      
      CREATE TABLE IF NOT EXISTS collective_memory (
        id TEXT PRIMARY KEY,
        swarm_id TEXT,
        key TEXT NOT NULL,
        value TEXT,
        type TEXT DEFAULT 'knowledge',
        confidence REAL DEFAULT 1.0,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        accessed_at DATETIME,
        access_count INTEGER DEFAULT 0,
        compressed INTEGER DEFAULT 0,
        size INTEGER DEFAULT 0,
        FOREIGN KEY (swarm_id) REFERENCES swarms(id)
      );
      
      CREATE TABLE IF NOT EXISTS consensus_decisions (
        id TEXT PRIMARY KEY,
        swarm_id TEXT,
        topic TEXT NOT NULL,
        decision TEXT,
        votes TEXT,
        algorithm TEXT DEFAULT 'majority',
        confidence REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (swarm_id) REFERENCES swarms(id)
      );
      
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        swarm_id TEXT NOT NULL,
        swarm_name TEXT NOT NULL,
        objective TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        paused_at DATETIME,
        resumed_at DATETIME,
        completion_percentage REAL DEFAULT 0,
        checkpoint_data TEXT,
        metadata TEXT,
        parent_pid INTEGER,
        child_pids TEXT,
        FOREIGN KEY (swarm_id) REFERENCES swarms(id)
      );
      
      CREATE TABLE IF NOT EXISTS session_checkpoints (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        checkpoint_name TEXT NOT NULL,
        checkpoint_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      );
      
      CREATE TABLE IF NOT EXISTS session_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        log_level TEXT DEFAULT 'info',
        message TEXT,
        agent_id TEXT,
        data TEXT,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      );
    `);
      spinner.text = 'Database schema created successfully';
    } catch (error) {
      console.error('Database schema creation failed:', error);
      throw new Error(`Failed to create database schema: ${error.message}`);
    }

    // Create swarm record with safe ID generation
    spinner.text = 'Creating swarm record...';
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 11); // Use substring instead of substr
    const swarmId = `swarm-${timestamp}-${randomPart}`;
    try {
      db.prepare(
        `
        INSERT INTO swarms (id, name, objective, queen_type)
        VALUES (?, ?, ?, ?)
      `,
      ).run(swarmId, hiveMind.config.name, objective, hiveMind.config.queenType);
    } catch (error) {
      console.error('Failed to create swarm record:', error);
      throw new Error(`Failed to create swarm record: ${error.message}`);
    }

    // Create session for this swarm
    spinner.text = 'Creating session tracking...';
    const sessionManager = new HiveMindSessionManager();
    const sessionId = await sessionManager.createSession(swarmId, hiveMind.config.name, objective, {
      queenType: hiveMind.config.queenType,
      maxWorkers: hiveMind.config.maxWorkers,
      consensusAlgorithm: hiveMind.config.consensusAlgorithm,
      autoScale: hiveMind.config.autoScale,
      encryption: hiveMind.config.encryption,
      workerTypes: flags.workerTypes,
    });

    spinner.text = 'Session tracking established...';

    // Initialize auto-save middleware (use the same session manager)
    const autoSave = createAutoSaveMiddleware(sessionId, sessionManager, {
      saveInterval: 30000, // Save every 30 seconds
      autoStart: true,
    });

    // Close session manager after auto-save is set up
    // sessionManager.close(); // Don't close yet as auto-save needs it

    // Track initial swarm creation
    autoSave.trackChange('swarm_created', {
      swarmId,
      swarmName: hiveMind.config.name,
      objective,
      workerCount: hiveMind.config.maxWorkers,
    });

    spinner.text = 'Initializing Queen coordinator...';

    // Initialize Queen
    const queen = new QueenCoordinator({
      swarmId,
      type: hiveMind.config.queenType,
      objective,
    });

    // Spawn Queen agent
    const queenAgent = {
      id: `queen-${swarmId}`,
      swarmId,
      name: 'Queen Coordinator',
      type: 'coordinator',
      role: 'queen',
      status: 'active',
      capabilities: JSON.stringify(['coordination', 'planning', 'decision-making']),
    };

    db.prepare(
      `
      INSERT INTO agents (id, swarm_id, name, type, role, status, capabilities)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(...Object.values(queenAgent));

    spinner.text = 'Spawning worker agents...';

    // Determine worker types
    const workerTypes = flags.workerTypes
      ? flags.workerTypes.split(',')
      : ['researcher', 'coder', 'analyst', 'tester'];

    // Spawn worker agents
    const workers = [];
    for (let i = 0; i < Math.min(workerTypes.length, hiveMind.config.maxWorkers); i++) {
      const workerType = workerTypes[i % workerTypes.length];
      const workerId = `worker-${swarmId}-${i}`;

      const worker = {
        id: workerId,
        swarmId,
        name: `${workerType.charAt(0).toUpperCase() + workerType.slice(1)} Worker ${i + 1}`,
        type: workerType,
        role: 'worker',
        status: 'idle',
        capabilities: JSON.stringify(getAgentCapabilities(workerType)),
      };

      workers.push(worker);

      db.prepare(
        `
        INSERT INTO agents (id, swarm_id, name, type, role, status, capabilities)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      ).run(...Object.values(worker));

      // Track agent spawning for auto-save
      autoSave.trackAgentActivity(workerId, 'spawned', {
        type: workerType,
        name: worker.name,
      });
    }

    spinner.text = 'Initializing collective memory...';

    // Initialize collective memory
    const memory = new CollectiveMemory({
      swarmId,
      maxSize: flags.memorySize || 100,
    });

    // Store initial context
    memory.store('objective', objective, 'context');
    memory.store('queen_type', hiveMind.config.queenType, 'config');
    memory.store('worker_count', workers.length, 'metrics');
    memory.store('session_id', sessionId, 'system');

    spinner.text = 'Establishing communication channels...';

    // Initialize communication system
    const communication = new SwarmCommunication({
      swarmId,
      encryption: hiveMind.config.encryption,
    });

    db.close();

    spinner.succeed('Hive Mind swarm spawned successfully!');

    // Display swarm summary
    console.log('\n' + chalk.bold('🐝 Swarm Summary:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.cyan('Swarm ID:'), swarmId);
    console.log(chalk.cyan('Session ID:'), sessionId);
    console.log(chalk.cyan('Name:'), hiveMind.config.name);
    console.log(chalk.cyan('Objective:'), objective);
    console.log(chalk.cyan('Queen Type:'), hiveMind.config.queenType);
    console.log(chalk.cyan('Workers:'), workers.length);
    console.log(chalk.cyan('Worker Types:'), workerTypes.join(', '));
    console.log(chalk.cyan('Consensus:'), hiveMind.config.consensusAlgorithm);
    console.log(chalk.cyan('Auto-scaling:'), hiveMind.config.autoScale ? 'Enabled' : 'Disabled');
    console.log(chalk.gray('─'.repeat(50)));

    // Launch monitoring if requested
    if (flags.monitor) {
      console.log('\n' + chalk.yellow('Launching monitoring dashboard...'));
      // TODO: Implement monitoring dashboard
    }

    // Enhanced coordination instructions with MCP tools
    console.log('\n' + chalk.green('✓') + ' Swarm is ready for coordination');
    console.log(chalk.gray('Use "claude-flow hive-mind status" to view swarm activity'));
    console.log(chalk.gray('Session auto-save enabled - progress saved every 30 seconds'));
    console.log(chalk.blue('💡 To pause:') + ' Press Ctrl+C to safely pause and resume later');
    console.log(chalk.blue('💡 To resume:') + ' claude-flow hive-mind resume ' + sessionId);

    // Set up SIGINT handler for automatic session pausing
    let isExiting = false;
    const sigintHandler = async () => {
      if (isExiting) return;
      isExiting = true;

      console.log('\n\n' + chalk.yellow('⏸️  Pausing session...'));
      
      try {
        // Save current checkpoint using the existing session manager
        // const sessionManager = new HiveMindSessionManager(); // Use existing one
        
        // Create checkpoint data
        const checkpointData = {
          timestamp: new Date().toISOString(),
          swarmId,
          objective,
          workerCount: workers.length,
          workerTypes,
          status: 'paused_by_user',
          reason: 'User pressed Ctrl+C',
        };
        
        // Save checkpoint
        await sessionManager.saveCheckpoint(sessionId, 'auto-pause', checkpointData);
        
        // Pause the session
        await sessionManager.pauseSession(sessionId);
        
        // Close session manager
        sessionManager.close();
        
        console.log(chalk.green('✓') + ' Session paused successfully');
        console.log(chalk.cyan('\nTo resume this session, run:'));
        console.log(chalk.bold(`  claude-flow hive-mind resume ${sessionId}`));
        console.log();
        
        // Clean up auto-save if active
        if (global.autoSaveInterval) {
          clearInterval(global.autoSaveInterval);
        }
        
        process.exit(0);
      } catch (error) {
        console.error(chalk.red('Error pausing session:'), error.message);
        process.exit(1);
      }
    };

    // Register SIGINT handler
    process.on('SIGINT', sigintHandler);
    process.on('SIGTERM', sigintHandler);

    // Offer to spawn Claude Code instances with coordination instructions
    // Spawn Claude if --claude or --spawn flag is set
    if (flags.claude || flags.spawn) {
      await spawnClaudeCodeInstances(swarmId, hiveMind.config.name, objective, workers, flags);
    } else {
      console.log(
        '\n' +
          chalk.blue('💡 Pro Tip:') +
          ' Add --claude to spawn coordinated Claude Code instances',
      );
      console.log(chalk.gray('   claude-flow hive-mind spawn "objective" --claude'));
    }

    // Return swarm info for wizard use
    return { swarmId, hiveMind };
  } catch (error) {
    spinner.fail('Failed to spawn Hive Mind swarm');
    console.error(chalk.red('Error:'), error.message);

    // If error contains "sha3", provide specific guidance
    if (error.message.includes('sha3') || error.message.includes('SHA3')) {
      console.error('\n🔍 SHA3 Function Error Detected');
      console.error('This appears to be a SQLite extension or better-sqlite3 configuration issue.');
      console.error('\nPossible solutions:');
      console.error('1. Try removing the corrupted database: rm -rf .hive-mind/');
      console.error('2. Reinstall better-sqlite3: npm reinstall better-sqlite3');
      console.error('3. Check if any SQLite extensions are conflicting');
      console.error('\n🚨 Detailed error:');
      console.error(error.stack || error.message);
    }

    exit(1);
  }
}
