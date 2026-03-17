async function enhancedClaudeFlowInit(flags, subArgs = []) {
  console.log('🚀 Initializing Claude Flow v2.0.0 with enhanced features...');

  const workingDir = process.cwd();
  const force = flags.force || flags.f;
  const dryRun = flags.dryRun || flags['dry-run'] || flags.d;
  const initSparc = flags.roo || (subArgs && subArgs.includes('--roo')); // SPARC only with --roo flag

  // Store parameters to avoid scope issues in async context
  const args = subArgs || [];
  const options = flags || {};

  // Import fs module for Node.js
  const fs = await import('fs/promises');
  const { chmod } = fs;

  try {
    // Check existing files
    const existingFiles = [];
    const filesToCheck = [
      'CLAUDE.md',
      '.claude/settings.json',
      '.mcp.json',
      // Removed claude-flow@alpha.config.json per user request
    ];

    for (const file of filesToCheck) {
      if (existsSync(`${workingDir}/${file}`)) {
        existingFiles.push(file);
      }
    }

    if (existingFiles.length > 0 && !force) {
      printWarning(`The following files already exist: ${existingFiles.join(', ')}`);
      console.log('Use --force to overwrite existing files');
      return;
    }

    // Create CLAUDE.md
    if (!dryRun) {
      await fs.writeFile(`${workingDir}/CLAUDE.md`, createOptimizedSparcClaudeMd(), 'utf8');
      printSuccess('✓ Created CLAUDE.md (Claude Flow v2.0.0 - Optimized)');
    } else {
      console.log('[DRY RUN] Would create CLAUDE.md (Claude Flow v2.0.0 - Optimized)');
    }

    // Create .claude directory structure
    const claudeDir = `${workingDir}/.claude`;
    if (!dryRun) {
      await fs.mkdir(claudeDir, { recursive: true });
      await fs.mkdir(`${claudeDir}/commands`, { recursive: true });
      await fs.mkdir(`${claudeDir}/helpers`, { recursive: true });
      printSuccess('✓ Created .claude directory structure');
    } else {
      console.log('[DRY RUN] Would create .claude directory structure');
    }

    // Create settings.json
    if (!dryRun) {
      await fs.writeFile(`${claudeDir}/settings.json`, createEnhancedSettingsJson(), 'utf8');
      printSuccess('✓ Created .claude/settings.json with hooks and MCP configuration');
    } else {
      console.log('[DRY RUN] Would create .claude/settings.json');
    }

    // Create settings.local.json with default MCP permissions
    const settingsLocal = {
      permissions: {
        allow: ['mcp__ruv-swarm', 'mcp__claude-flow@alpha'],
        deny: [],
      },
    };

    if (!dryRun) {
      await fs.writeFile(
        `${claudeDir}/settings.local.json`, JSON.stringify(settingsLocal, null, 2, 'utf8'),
      );
      printSuccess('✓ Created .claude/settings.local.json with default MCP permissions');
    } else {
      console.log(
        '[DRY RUN] Would create .claude/settings.local.json with default MCP permissions',
      );
    }

    // Create .mcp.json at project root for MCP server configuration
    const mcpConfig = {
      mcpServers: {
        'claude-flow@alpha': {
          command: 'npx',
          args: ['claude-flow@alpha', 'mcp', 'start'],
          type: 'stdio',
        },
        'ruv-swarm': {
          command: 'npx',
          args: ['ruv-swarm@latest', 'mcp', 'start'],
          type: 'stdio',
        },
        // Optional: Uncomment to enable Flow Nexus cloud features
        // 'flow-nexus': {
        //   command: 'npx',
        //   args: ['flow-nexus@latest', 'mcp', 'start'],
        //   type: 'stdio',
        // },
      },
    };

    if (!dryRun) {
      await fs.writeFile(`${workingDir}/.mcp.json`, JSON.stringify(mcpConfig, null, 2, 'utf8'));
      printSuccess('✓ Created .mcp.json at project root for MCP server configuration');
    } else {
      console.log('[DRY RUN] Would create .mcp.json at project root for MCP server configuration');
    }

    // Removed claude-flow@alpha.config.json creation per user request

    // Create command documentation
    for (const [category, commands] of Object.entries(COMMAND_STRUCTURE)) {
      const categoryDir = `${claudeDir}/commands/${category}`;

      if (!dryRun) {
        await fs.mkdir(categoryDir, { recursive: true });

        // Create category README
        const categoryReadme = `# ${category.charAt(0).toUpperCase() + category.slice(1)} Commands

Commands for ${category} operations in Claude Flow.

## Available Commands

${commands.map((cmd) => `- [${cmd}](./${cmd}.md)`).join('\n')}
`;
        await fs.writeFile(`${categoryDir}/README.md`, categoryReadme, 'utf8');

        // Create individual command docs
        for (const command of commands) {
          const doc = createCommandDoc(category, command);
          if (doc) {
            await fs.writeFile(`${categoryDir}/${command}.md`, doc, 'utf8');
          }
        }

        console.log(`  ✓ Created ${commands.length} ${category} command docs`);
      } else {
        console.log(`[DRY RUN] Would create ${commands.length} ${category} command docs`);
      }
    }

    // Create wrapper scripts using the dedicated function
    if (!dryRun) {
      await createLocalExecutable(workingDir, dryRun);
    } else {
      console.log('[DRY RUN] Would create wrapper scripts');
    }

    // Create helper scripts
    const helpers = ['setup-mcp.sh', 'quick-start.sh', 'github-setup.sh', 'github-safe.js', 'standard-checkpoint-hooks.sh', 'checkpoint-manager.sh'];
    for (const helper of helpers) {
      if (!dryRun) {
        const content = createHelperScript(helper);
        if (content) {
          await fs.writeFile(`${claudeDir}/helpers/${helper}`, content, 'utf8');
          await fs.chmod(`${claudeDir}/helpers/${helper}`, 0o755);
        }
      }
    }

    if (!dryRun) {
      printSuccess(`✓ Created ${helpers.length} helper scripts`);
    } else {
      console.log(`[DRY RUN] Would create ${helpers.length} helper scripts`);
    }

    // Create standard directories from original init
    const standardDirs = [
      'memory',
      'memory/agents',
      'memory/sessions',
      'coordination',
      'coordination/memory_bank',
      'coordination/subtasks',
      'coordination/orchestration',
      '.swarm', // Add .swarm directory for shared memory
      '.hive-mind', // Add .hive-mind directory for hive-mind system
      '.claude/checkpoints', // Add checkpoints directory for Git checkpoint system
    ];

    for (const dir of standardDirs) {
      if (!dryRun) {
        await fs.mkdir(`${workingDir}/${dir}`, { recursive: true });
      }
    }

    if (!dryRun) {
      printSuccess('✓ Created standard directory structure');

      // Initialize memory system
      const initialData = { agents: [], tasks: [], lastUpdated: Date.now() };
      await fs.writeFile(
        `${workingDir}/memory/claude-flow@alpha-data.json`, JSON.stringify(initialData, null, 2, 'utf8'),
      );

      // Create README files
      await fs.writeFile(`${workingDir}/memory/agents/README.md`, createAgentsReadme(), 'utf8');
      await fs.writeFile(`${workingDir}/memory/sessions/README.md`, createSessionsReadme(), 'utf8');

      printSuccess('✓ Initialized memory system');

      // Initialize memory database with fallback support
      try {
        // Import and initialize FallbackMemoryStore to create the database
        const { FallbackMemoryStore } = await import('../../../memory/fallback-store.js');
        const memoryStore = new FallbackMemoryStore();
        await memoryStore.initialize();

        if (memoryStore.isUsingFallback()) {
          printSuccess('✓ Initialized memory system (in-memory fallback for npx compatibility)');
          console.log(
            '  💡 For persistent storage, install locally: npm install claude-flow@alpha',
          );
        } else {
          printSuccess('✓ Initialized memory database (.swarm/memory.db)');
        }

        memoryStore.close();
      } catch (err) {
        console.log(`  ⚠️  Could not initialize memory system: ${err.message}`);
        console.log('     Memory will be initialized on first use');
      }

      // Initialize comprehensive hive-mind system
      console.log('\n🧠 Initializing Hive Mind System...');
      try {
        const hiveMindOptions = {
          config: {
            integration: {
              claudeCode: { enabled: isClaudeCodeInstalled() },
              mcpTools: { enabled: true }
            },
            monitoring: { enabled: flags.monitoring || false }
          }
        };
        
        const hiveMindResult = await initializeHiveMind(workingDir, hiveMindOptions, dryRun);
        
        if (hiveMindResult.success) {
          printSuccess(`✓ Hive Mind System initialized with ${hiveMindResult.features.length} features`);
          
          // Log individual features
          hiveMindResult.features.forEach(feature => {
            console.log(`    • ${feature}`);
          });
        } else {
          console.log(`  ⚠️  Hive Mind initialization failed: ${hiveMindResult.error}`);
          if (hiveMindResult.rollbackRequired) {
            console.log('  🔄 Automatic rollback may be required');
          }
        }
      } catch (err) {
        console.log(`  ⚠️  Could not initialize hive-mind system: ${err.message}`);
      }
    }

    // Update .gitignore with Claude Flow entries
    const gitignoreResult = await updateGitignore(workingDir, force, dryRun);
    if (gitignoreResult.success) {
      if (!dryRun) {
        printSuccess(`✓ ${gitignoreResult.message}`);
      } else {
        console.log(gitignoreResult.message);
      }
    } else {
      console.log(`  ⚠️  ${gitignoreResult.message}`);
    }

    // SPARC initialization (only with --roo flag)
    let sparcInitialized = false;
    if (initSparc) {
      console.log('\n🚀 Initializing SPARC development environment...');
      try {
        // Run create-sparc
        console.log('  🔄 Running: npx -y create-sparc init --force');
        execSync('npx -y create-sparc init --force', {
          cwd: workingDir,
          stdio: 'inherit',
        });
        sparcInitialized = true;
        printSuccess('✅ SPARC environment initialized successfully');
      } catch (err) {
        console.log(`  ⚠️  Could not run create-sparc: ${err.message}`);
        console.log('     SPARC features will be limited to basic functionality');
      }
    }

    // Create Claude slash commands for SPARC
    if (sparcInitialized && !dryRun) {
      console.log('\n📝 Creating Claude Code slash commands...');
      await createClaudeSlashCommands(workingDir);
    }

    // Check for Claude Code and set up MCP servers (always enabled by default)
    if (!dryRun && isClaudeCodeInstalled()) {
      console.log('\n🔍 Claude Code CLI detected!');
      const skipMcp =
        (options && options['skip-mcp']) ||
        (subArgs && subArgs.includes && subArgs.includes('--skip-mcp'));

      if (!skipMcp) {
        await setupMcpServers(dryRun);
      } else {
        console.log('  ℹ️  Skipping MCP setup (--skip-mcp flag used)');
        console.log('\n  📋 To add MCP servers manually:');
        console.log('     claude mcp add claude-flow@alpha npx claude-flow@alpha mcp start');
        console.log('     claude mcp add ruv-swarm npx ruv-swarm@latest mcp start');
        console.log('');
        console.log('  📦 Optional MCP servers (flow-nexus is already installed as a dependency):');
        console.log('     claude mcp add flow-nexus npx flow-nexus@latest mcp start  # Cloud features');
        console.log('\n  💡 MCP servers are defined in .mcp.json (project scope)');
      }
    } else if (!dryRun && !isClaudeCodeInstalled()) {
      console.log('\n⚠️  Claude Code CLI not detected!');
      console.log('\n  📥 To install Claude Code:');
      console.log('     npm install -g @anthropic-ai/claude-code');
      console.log('\n  📋 After installing, add MCP servers:');
      console.log('     claude mcp add claude-flow npx claude-flow@alpha mcp start');
      console.log('     claude mcp add ruv-swarm npx ruv-swarm@latest mcp start');
      console.log('');
      console.log('  📦 Optional MCP servers (flow-nexus is already installed as a dependency):');
      console.log('     claude mcp add flow-nexus npx flow-nexus@latest mcp start  # Cloud features');
      console.log('\n  💡 MCP servers are defined in .mcp.json (project scope)');
    }

    // Create agent directories and copy all agent files
    console.log('\n🤖 Setting up agent system...');
    if (!dryRun) {
      await createAgentDirectories(workingDir, dryRun);
      const agentResult = await copyAgentFiles(workingDir, {
        force: force,
        dryRun: dryRun
      });
      
      if (agentResult.success) {
        await validateAgentSystem(workingDir);
        
        
        // Copy command files including Flow Nexus commands
        console.log('\n📚 Setting up command system...');
        const commandResult = await copyCommandFiles(workingDir, {
          force: force,
          dryRun: dryRun
        });
        
        if (commandResult.success) {
          console.log('✅ ✓ Command system setup complete with Flow Nexus integration');
        } else {
          console.log('⚠️  Command system setup failed:', commandResult.error);
        }

        // Copy skill files including skill-builder
        console.log('\n🎯 Setting up skill system...');
        const skillResult = await copySkillFiles(workingDir, {
          force: force,
          dryRun: dryRun
        });

        if (skillResult.success) {
          await validateSkillSystem(workingDir);
          console.log('✅ ✓ Skill system setup complete with skill-builder');
        } else {
          console.log('⚠️  Skill system setup failed:', skillResult.error);
        }

        console.log('✅ ✓ Agent system setup complete with 64 specialized agents');
      } else {
        console.log('⚠️  Agent system setup failed:', agentResult.error);
      }
    } else {
      console.log('  [DRY RUN] Would create agent system with 64 specialized agents');
    }

    // Optional: Setup monitoring and telemetry
    const enableMonitoring = flags.monitoring || flags['enable-monitoring'];
    if (enableMonitoring && !dryRun) {
      console.log('\n📊 Setting up monitoring and telemetry...');
      await setupMonitoring(workingDir);
    }
    
    // Final instructions with hive-mind status
    console.log('\n🎉 Claude Flow v2.0.0 initialization complete!');
    
    // Display hive-mind status
    const hiveMindStatus = getHiveMindStatus(workingDir);
    console.log('\n🧠 Hive Mind System Status:');
    console.log(`  Configuration: ${hiveMindStatus.configured ? '✅ Ready' : '❌ Missing'}`);
    console.log(`  Database: ${hiveMindStatus.database === 'sqlite' ? '✅ SQLite' : hiveMindStatus.database === 'fallback' ? '⚠️ JSON Fallback' : '❌ Not initialized'}`);
    console.log(`  Directory Structure: ${hiveMindStatus.directories ? '✅ Created' : '❌ Missing'}`);
    
    console.log('\n📚 Quick Start:');
    if (isClaudeCodeInstalled()) {
      console.log('1. View available commands: ls .claude/commands/');
      console.log('2. Start a swarm: npx claude-flow@alpha swarm "your objective" --claude');
      console.log('3. Use hive-mind: npx claude-flow@alpha hive-mind spawn "command" --claude');
      console.log('4. Use MCP tools in Claude Code for enhanced coordination');
      if (hiveMindStatus.configured) {
        console.log('5. Initialize first swarm: npx claude-flow@alpha hive-mind init');
      }
    } else {
      console.log('1. Install Claude Code: npm install -g @anthropic-ai/claude-code');
      console.log('2. Add MCP servers (see instructions above)');
      console.log('3. View available commands: ls .claude/commands/');
      console.log('4. Start a swarm: npx claude-flow@alpha swarm "your objective" --claude');
      console.log('5. Use hive-mind: npx claude-flow@alpha hive-mind spawn "command" --claude');
      if (hiveMindStatus.configured) {
        console.log('6. Initialize first swarm: npx claude-flow@alpha hive-mind init');
      }
    }
    console.log('\n💡 Tips:');
    console.log('• Check .claude/commands/ for detailed documentation');
    console.log('• Use --help with any command for options');
    console.log('• Run commands with --claude flag for best Claude Code integration');
    console.log('• Enable GitHub integration with .claude/helpers/github-setup.sh');
    console.log('• Git checkpoints are automatically enabled in settings.json');
    console.log('• Use .claude/helpers/checkpoint-manager.sh for easy rollback');
  } catch (err) {
    printError(`Failed to initialize Claude Flow v2.0.0: ${err.message}`);
    
    // Attempt hive-mind rollback if it was partially initialized
    try {
      const hiveMindStatus = getHiveMindStatus(workingDir);
      if (hiveMindStatus.directories || hiveMindStatus.configured) {
        console.log('\n🔄 Attempting hive-mind system rollback...');
        const rollbackResult = await rollbackHiveMindInit(workingDir);
        if (rollbackResult.success) {
          console.log('  ✅ Hive-mind rollback completed');
        } else {
          console.log(`  ⚠️  Hive-mind rollback failed: ${rollbackResult.error}`);
        }
      }
    } catch (rollbackErr) {
      console.log(`  ⚠️  Rollback error: ${rollbackErr.message}`);
    }
  }
}
