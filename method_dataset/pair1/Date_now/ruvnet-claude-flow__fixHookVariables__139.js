async function fixHookVariables(settingsPath, options = {}) {
  const { backup = true, syntax = 'auto' } = options;

  try {
    // Read settings
    const content = await fs.readFile(settingsPath, 'utf8');
    const settings = JSON.parse(content);

    if (!settings.hooks) {
      printWarning('No hooks found in settings.json');
      return { success: true, changes: 0 };
    }

    // Backup if requested
    if (backup) {
      const backupPath = `${settingsPath}.backup-${Date.now()}`;
      await fs.writeFile(backupPath, content);
      console.log(chalk.gray(`  Created backup: ${backupPath}`));
    }

    // Detect working syntax
    const targetSyntax = syntax === 'auto' ? await detectWorkingSyntax() : syntax;
    console.log(chalk.blue(`  Using ${targetSyntax} syntax`));

    // Collect all commands that need transformation
    const commands = [];
    let changes = 0;

    // Transform hooks
    const transformHooks = (hooks) => {
      if (Array.isArray(hooks)) {
        return hooks.map((hook) => {
          if (hook.hooks && Array.isArray(hook.hooks)) {
            hook.hooks = hook.hooks.map((h) => {
              if (h.command && h.command.includes('${')) {
                commands.push(h.command);
                const newCommand = transformHookCommand(h.command, 'legacy', targetSyntax);
                if (newCommand !== h.command) {
                  changes++;
                  return { ...h, command: newCommand };
                }
              }
              return h;
            });
          }
          return hook;
        });
      }
      return hooks;
    };

    // Process all hook types
    for (const [hookType, hooks] of Object.entries(settings.hooks)) {
      settings.hooks[hookType] = transformHooks(hooks);
    }

    // Create wrapper scripts if needed
    if (targetSyntax === 'wrapper' && commands.length > 0) {
      console.log(chalk.blue('  Creating wrapper scripts...'));
      const scripts = await createWrapperScripts(commands);
      console.log(chalk.green(`  Created ${scripts.size} wrapper scripts`));
    }

    // Save updated settings
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));

    return { success: true, changes };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
