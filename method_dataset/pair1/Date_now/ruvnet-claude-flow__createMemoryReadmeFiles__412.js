async function createMemoryReadmeFiles(targetDir, options, results) {
  const { createAgentsReadme, createSessionsReadme } = await import('./templates/readme-files.js');
  
  const readmeFiles = [
    { path: 'memory/agents/README.md', content: createAgentsReadme() },
    { path: 'memory/sessions/README.md', content: createSessionsReadme() },
  ];

  for (const { path, content } of readmeFiles) {
    const fullPath = join(targetDir, path);
    
    try {
      if (!options.dryRun) {
        await fs.mkdir(dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content);
      }
      console.log(`  ${options.dryRun ? '[DRY RUN] Would create' : '✓ Created'} ${path}`);
      results.copiedFiles.push(path);
    } catch (err) {
      results.errors.push(`Failed to create ${path}: ${err.message}`);
    }
  }

  // Initialize persistence database
  const dbPath = join(targetDir, 'memory', 'claude-flow-data.json');
  const initialData = {
    agents: [],
    tasks: [],
    lastUpdated: Date.now(),
  };

  try {
    if (!options.dryRun) {
      await fs.writeFile(dbPath, JSON.stringify(initialData, null, 2));
    }
    console.log(`  ${options.dryRun ? '[DRY RUN] Would create' : '✓ Created'} memory/claude-flow-data.json (persistence database)`);
    results.copiedFiles.push('memory/claude-flow-data.json');
  } catch (err) {
    results.errors.push(`Failed to create persistence database: ${err.message}`);
  }
}
