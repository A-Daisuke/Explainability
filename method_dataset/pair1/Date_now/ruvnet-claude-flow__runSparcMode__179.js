async function runSparcMode(subArgs, flags) {
  const runModeSlug = subArgs[1];
  const taskDescription = subArgs
    .slice(2)
    .filter((arg) => !arg.startsWith('--'))
    .join(' ');

  if (!runModeSlug || !taskDescription) {
    printError('Usage: sparc run <mode-slug> <task-description>');
    return;
  }

  try {
    // Get the actual working directory where the command was run from
    const workingDir = process.env.PWD || cwd();
    const configPath = `${workingDir}/.roomodes`;
    let configContent;
    try {
      configContent = await fs.readFile(configPath, 'utf8');
    } catch (error) {
      printError('SPARC configuration file (.roomodes) not found');
      console.log(`Please ensure .roomodes file exists in: ${workingDir}`);
      console.log();
      console.log('To enable SPARC development modes, run:');
      console.log('  npx claude-flow@latest init --sparc');
      return;
    }
    const config = JSON.parse(configContent);
    const mode = config.customModes.find((m) => m.slug === runModeSlug);

    if (!mode) {
      printError(`Mode not found: ${runModeSlug}`);
      return;
    }

    // Build enhanced SPARC prompt
    const memoryNamespace = subArgs.includes('--namespace')
      ? subArgs[subArgs.indexOf('--namespace') + 1]
      : mode.slug;

    const enhancedTask = createSparcPrompt(mode, taskDescription, memoryNamespace);

    // Build tools based on mode groups
    const tools = buildToolsFromGroups(mode.groups);
    const toolsList = Array.from(tools).join(',');
    const instanceId = `sparc-${runModeSlug}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (subArgs.includes('--dry-run') || subArgs.includes('-d')) {
      printWarning('DRY RUN - SPARC Mode Configuration:');
      console.log(`Mode: ${mode.name} (${mode.slug})`);
      console.log(`Instance ID: ${instanceId}`);

      const enablePermissions = subArgs.includes('--enable-permissions');
      if (!enablePermissions) {
        console.log(`Tools: ALL (via --dangerously-skip-permissions)`);
        console.log(`Permissions: Will be auto-skipped`);
      } else {
        console.log(`Tools: ${toolsList}`);
        console.log(`Permissions: Will prompt for actions`);
      }

      console.log(`Task: ${taskDescription}`);
      console.log();
      console.log('Enhanced prompt preview:');
      console.log(enhancedTask.substring(0, 300) + '...');
      return;
    }

    printSuccess(`Starting SPARC mode: ${mode.name}`);
    console.log(`📝 Instance ID: ${instanceId}`);
    console.log(`🎯 Mode: ${mode.slug}`);

    const isNonInteractive = subArgs.includes('--non-interactive') || subArgs.includes('-n');
    const enablePermissions = subArgs.includes('--enable-permissions');

    if (!enablePermissions) {
      console.log(`🔧 Tools: ALL (including MCP and WebSearch via --dangerously-skip-permissions)`);
      console.log(`⚡ Permissions: Auto-skipped (--dangerously-skip-permissions)`);
    } else {
      console.log(`🔧 Tools: ${toolsList}`);
      console.log(`✅ Permissions: Enabled (will prompt for actions)`);
    }
    console.log(`📋 Task: ${taskDescription}`);

    if (isNonInteractive) {
      console.log(`🚀 Running in non-interactive mode with stream-json output`);
      console.log();

      // Show debug info immediately for non-interactive mode
      console.log('🔍 Debug: Preparing claude command...');
      console.log(`Enhanced prompt length: ${enhancedTask.length} characters`);
      console.log(`First 200 chars of prompt: ${enhancedTask.substring(0, 200)}...`);
    }
    console.log();

    // Execute Claude with SPARC configuration
    await executeClaude(enhancedTask, toolsList, instanceId, memoryNamespace, subArgs);
  } catch (err) {
    printError(`Failed to run SPARC mode: ${err.message}`);
  }
}
