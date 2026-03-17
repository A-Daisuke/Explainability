async function cleanSessions(options: any): Promise<void> {
  try {
    await ensureSessionDir();
    const sessions = await loadAllSessions();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(options.olderThan));

    let toDelete = sessions.filter((session) => session.createdAt < cutoffDate);

    if (options.orphaned) {
      // In production, check if sessions have valid references
      toDelete = toDelete.filter((session) => (session.metadata as any).orphaned);
    }

    if (toDelete.length === 0) {
      console.log(chalk.gray('No sessions to clean'));
      return;
    }

    console.log(chalk.cyan.bold(`Sessions to clean (${toDelete.length})`));
    console.log('─'.repeat(50));

    for (const session of toDelete) {
      const age = Math.floor((Date.now() - session.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      console.log(
        `• ${session.name} (${chalk.gray(session.id.substring(0, 8) + '...')}) - ${age} days old`,
      );
    }

    if (options.dryRun) {
      console.log('\n' + chalk.yellow('Dry run mode - no files were deleted'));
      return;
    }

    console.log();
    const response = await inquirer.prompt({
      type: 'confirm',
      name: 'confirmed',
      message: `Delete ${toDelete.length} sessions?`,
      default: false,
    });
    const confirmed = response.confirmed;

    if (!confirmed) {
      console.log(chalk.gray('Clean cancelled'));
      return;
    }

    let deleted = 0;
    for (const session of toDelete) {
      try {
        const filePath = `${SESSION_DIR}/${session.id}.json`;
        await fs.unlink(filePath);
        deleted++;
      } catch (error) {
        console.error(chalk.red(`Failed to delete ${session.name}:`), (error as Error).message);
      }
    }

    console.log(chalk.green(`✓ Cleaned ${deleted} sessions`));
  } catch (error) {
    console.error(chalk.red('Failed to clean sessions:'), (error as Error).message);
  }
}
