function __method_wrapper__() {
    action: async (ctx: CommandContext) => {
      try {
        success('Initializing Claude Code integration files...');

        const force = (ctx.flags.force as boolean) || (ctx.flags.f as boolean);
        const minimal = (ctx.flags.minimal as boolean) || (ctx.flags.m as boolean);
        const flowNexus = ctx.flags['flow-nexus'] as boolean;

        // Handle Flow Nexus minimal init
        if (flowNexus) {
          success('Initializing Flow Nexus minimal setup...');
          
          // Create Flow Nexus CLAUDE.md with integrated section
          const flowNexusClaudeMd = createFlowNexusClaudeMd();
          const { writeFile, mkdir } = await import('fs/promises');
          await writeFile('CLAUDE.md', flowNexusClaudeMd);
          console.log('  ✓ Created CLAUDE.md with Flow Nexus integration');
          
          // Create .claude/commands/flow-nexus directory and copy commands
          await mkdir('.claude/commands/flow-nexus', { recursive: true });
          
          // Create .claude/agents/flow-nexus directory and copy agents
          await mkdir('.claude/agents/flow-nexus', { recursive: true });
          
          success('Flow Nexus initialization complete!');
          console.log('📚 Created: CLAUDE.md with Flow Nexus documentation');
          console.log('📁 Created: .claude/commands/flow-nexus/ directory structure');  
          console.log('🤖 Created: .claude/agents/flow-nexus/ directory structure');
          console.log('💡 Use MCP Flow Nexus tools in Claude Code for full functionality');
          return;
        }

        // Check if files already exist for full init
        const files = ['CLAUDE.md', 'memory-bank.md', 'coordination.md'];
        const existingFiles = [];

        for (const file of files) {
          const { access } = await import('fs/promises');
          const exists = await access(file)
            .then(() => true)
            .catch(() => false);
          if (exists) {
            existingFiles.push(file);
          }
        }

        if (existingFiles.length > 0 && !force) {
          warning(`The following files already exist: ${existingFiles.join(', ')}`);
          console.log('Use --force to overwrite existing files');
          return;
        }

        // Create CLAUDE.md
        const claudeMd = minimal ? createMinimalClaudeMd() : createFullClaudeMd();
        const { writeFile } = await import('fs/promises');
        await writeFile('CLAUDE.md', claudeMd);
        console.log('  ✓ Created CLAUDE.md');

        // Create memory-bank.md
        const memoryBankMd = minimal ? createMinimalMemoryBankMd() : createFullMemoryBankMd();
        await writeFile('memory-bank.md', memoryBankMd);
        console.log('  ✓ Created memory-bank.md');

        // Create coordination.md
        const coordinationMd = minimal ? createMinimalCoordinationMd() : createFullCoordinationMd();
        await writeFile('coordination.md', coordinationMd);
        console.log('  ✓ Created coordination.md');

        // Create directory structure
        const directories = [
          'memory',
          'memory/agents',
          'memory/sessions',
          'coordination',
          'coordination/memory_bank',
          'coordination/subtasks',
          'coordination/orchestration',
        ];

        // Ensure memory directory exists for SQLite database
        if (!directories.includes('memory')) {
          directories.unshift('memory');
        }

        const { mkdir } = await import('fs/promises');
        for (const dir of directories) {
          try {
            await mkdir(dir, { recursive: true });
            console.log(`  ✓ Created ${dir}/ directory`);
          } catch (err) {
            if ((err as any).code !== 'EEXIST') {
              throw err;
            }
          }
        }

        // Create placeholder files for memory directories
        const agentsReadme = createAgentsReadme();
        await writeFile('memory/agents/README.md', agentsReadme);
        console.log('  ✓ Created memory/agents/README.md');

        const sessionsReadme = createSessionsReadme();
        await writeFile('memory/sessions/README.md', sessionsReadme);
        console.log('  ✓ Created memory/sessions/README.md');

        // Initialize the persistence database
        const initialData = {
          agents: [],
          tasks: [],
          lastUpdated: Date.now(),
        };
        await writeFile('memory/claude-flow-data.json', JSON.stringify(initialData, null, 2));
        console.log('  ✓ Created memory/claude-flow-data.json (persistence database)');

        success('Claude Code integration files initialized successfully!');
        console.log('\nNext steps:');
        console.log('1. Review and customize the generated files for your project');
        console.log("2. Run 'npx claude-flow start' to begin the orchestration system");
        console.log("3. Use 'claude --dangerously-skip-permissions' for unattended operation");
        console.log('\nNote: Persistence database initialized at memory/claude-flow-data.json');
      } catch (err) {
        error(`Failed to initialize files: ${(err as Error).message}`);
      }
    },

}
