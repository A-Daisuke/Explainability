async function runSparcMode(ctx: CommandContext): Promise<void> {
  const modeSlug = ctx.args[1];
  const taskDescription = ctx.args.slice(2).join(' ');

  if (!modeSlug || !taskDescription) {
    error('Usage: sparc run <mode-slug> <task-description>');
    return;
  }

  try {
    const config = await loadSparcConfig();
    const mode = config.customModes.find((m) => m.slug === modeSlug);

    if (!mode) {
      error(`Mode not found: ${modeSlug}`);
      return;
    }

    // Build the enhanced task prompt using SPARC methodology
    const enhancedTask = buildSparcPrompt(mode, taskDescription, ctx.flags);
    const instanceId = `sparc-${modeSlug}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Build tools based on mode groups
    const tools = buildToolsFromGroups(mode.groups);

    if (ctx.flags.dryRun || ctx.flags['dry-run']) {
      warning('DRY RUN - SPARC Mode Configuration:');
      console.log(`Mode: ${mode.name} (${mode.slug})`);
      console.log(`Instance ID: ${instanceId}`);
      console.log(`Tools: ${tools}`);
      console.log(`Task: ${taskDescription}`);
      console.log();
      console.log('Enhanced prompt preview:');
      console.log(enhancedTask.substring(0, 300) + '...');
      return;
    }

    success(`Starting SPARC mode: ${mode.name}`);
    console.log(`📝 Instance ID: ${instanceId}`);
    console.log(`🎯 Mode: ${mode.slug}`);
    console.log(`🔧 Tools: ${tools}`);
    console.log(`📋 Task: ${taskDescription}`);
    console.log();

    // Execute Claude with SPARC configuration
    await executeClaudeWithSparc(enhancedTask, tools, instanceId, ctx.flags);
  } catch (err) {
    error(`Failed to run SPARC mode: ${(err as Error).message}`);
  }
}
