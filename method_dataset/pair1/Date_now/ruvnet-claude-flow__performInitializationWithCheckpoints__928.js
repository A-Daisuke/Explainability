async function performInitializationWithCheckpoints(
  rollbackSystem,
  options,
  workingDir,
  dryRun = false,
) {
  const phases = [
    { name: 'file-creation', action: () => createInitialFiles(options, workingDir, dryRun) },
    { name: 'directory-structure', action: () => createDirectoryStructure(workingDir, dryRun) },
    { name: 'memory-setup', action: () => setupMemorySystem(workingDir, dryRun) },
    { name: 'coordination-setup', action: () => setupCoordinationSystem(workingDir, dryRun) },
    { name: 'executable-creation', action: () => createLocalExecutable(workingDir, dryRun) },
  ];

  if (options.sparc) {
    phases.push(
      { name: 'sparc-init', action: () => createSparcStructureManually() },
      { name: 'claude-commands', action: () => createClaudeSlashCommands(workingDir) },
    );
  }

  for (const phase of phases) {
    console.log(`  🔧 ${phase.name}...`);

    // Create checkpoint before phase
    await rollbackSystem.createCheckpoint(phase.name, {
      timestamp: Date.now(),
      phase: phase.name,
    });

    try {
      await phase.action();
      console.log(`  ✅ ${phase.name} completed`);
    } catch (error) {
      console.error(`  ❌ ${phase.name} failed: ${error.message}`);
      throw error;
    }
  }
}
