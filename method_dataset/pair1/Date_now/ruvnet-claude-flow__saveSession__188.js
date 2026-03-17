async function saveSession(name: string | undefined, options: any): Promise<void> {
  try {
    // Get current session state (mock for now)
    const currentState = await getCurrentSessionState();

    if (!name) {
      if (options.auto) {
        name = `session-${new Date().toISOString().split('T')[0]}-${Date.now().toString().slice(-4)}`;
      } else {
        const response = await inquirer.prompt({
          type: 'input',
          name: 'sessionName',
          message: 'Enter session name:',
          default: `session-${new Date().toISOString().split('T')[0]}`,
        });
        name = response.sessionName;
      }
    }

    const session: SessionData = {
      id: generateId('session'),
      name: name!,
      description: options.description,
      tags: options.tags ? options.tags.split(',').map((t: string) => t.trim()) : [],
      createdAt: new Date(),
      updatedAt: new Date(),
      state: currentState,
      metadata: {
        version: '1.0.0',
        platform: process.platform,
        checksum: await calculateChecksum(currentState),
      },
    };

    await ensureSessionDir();
    const filePath = `${SESSION_DIR}/${session.id}.json`;
    await fs.writeFile(filePath, JSON.stringify(session, null, 2));

    console.log(chalk.green('✓ Session saved successfully'));
    console.log(`${chalk.white('ID:')} ${session.id}`);
    console.log(`${chalk.white('Name:')} ${session.name}`);
    console.log(`${chalk.white('File:')} ${filePath}`);

    if (session.description) {
      console.log(`${chalk.white('Description:')} ${session.description}`);
    }

    console.log(`${chalk.white('Agents:')} ${session.state.agents.length}`);
    console.log(`${chalk.white('Tasks:')} ${session.state.tasks.length}`);
  } catch (error) {
    console.error(chalk.red('Failed to save session:'), (error as Error).message);
  }
}
