export async function createDirectoryStructure(): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');

  // Define directory structure
  const directories = [
    '.claude',
    '.claude/commands',
    '.claude/commands/swarm',
    '.claude/commands/sparc',
    '.claude/logs',
    '.claude/memory',
    '.claude/configs',
    'memory',
    'memory/agents',
    'memory/sessions',
    'coordination',
    'coordination/memory_bank',
    'coordination/subtasks',
    'coordination/orchestration',
    'reports',
  ];

  // Create directories
  for (const dir of directories) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(`  ✅ Created ${dir}/ directory`);
    } catch (error: unknown) {
      if ((error as any).code !== 'EEXIST') {
        throw error;
      }
    }
  }

  // Create README files for key directories
  const readmeFiles = {
    'memory/agents/README.md': createAgentsReadme(),
    'memory/sessions/README.md': createSessionsReadme(),
    'coordination/README.md': createCoordinationReadme(),
    'reports/README.md': createReportsReadme(),
  };

  for (const [filePath, content] of Object.entries(readmeFiles)) {
    await fs.writeFile(filePath, content);
    console.log(`  ✅ Created ${filePath}`);
  }

  // Create initial persistence database
  const initialData = {
    agents: [],
    tasks: [],
    swarms: [],
    lastUpdated: Date.now(),
    version: '1.0.71',
  };

  await fs.writeFile('memory/claude-flow-data.json', JSON.stringify(initialData, null, 2));
  console.log('  ✅ Created memory/claude-flow-data.json (persistence database)');
}
