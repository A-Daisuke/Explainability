async function runSparcWorkflow(ctx: CommandContext): Promise<void> {
  const workflowFile = ctx.args[1];

  if (!workflowFile) {
    error('Usage: sparc workflow <workflow-file.json>');
    return;
  }

  try {
    const { readFile } = await import('fs/promises');
    const workflowContent = await readFile(workflowFile, 'utf-8');
    const workflow = JSON.parse(workflowContent);

    if (!workflow.steps || !Array.isArray(workflow.steps)) {
      error("Invalid workflow file: missing 'steps' array");
      return;
    }

    const config = await loadSparcConfig();

    success(`Loading SPARC workflow: ${workflow.name || 'Unnamed'}`);
    console.log(`📋 Steps: ${workflow.steps.length}`);
    console.log(`📝 Description: ${workflow.description || 'No description'}`);
    console.log();

    if (ctx.flags.dryRun || ctx.flags['dry-run']) {
      warning('DRY RUN - Workflow Steps:');
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        console.log(`${i + 1}. ${cyan(step.mode)} - ${step.description || step.task}`);
      }
      return;
    }

    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      const mode = config.customModes.find((m) => m.slug === step.mode);

      if (!mode) {
        warning(`Mode not found: ${step.mode}, skipping step ${i + 1}`);
        continue;
      }

      info(`Step ${i + 1}/${workflow.steps.length}: ${mode.name}`);
      console.log(`📋 ${step.description || step.task}`);
      console.log();

      const enhancedTask = buildSparcPrompt(mode, step.description || step.task, {
        ...ctx.flags,
        workflowStep: i + 1,
        totalSteps: workflow.steps.length,
        workflowName: workflow.name,
      });

      const tools = buildToolsFromGroups(mode.groups);
      const instanceId = `sparc-workflow-${i + 1}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

      await executeClaudeWithSparc(enhancedTask, tools, instanceId, ctx.flags);

      if (workflow.sequential !== false && i < workflow.steps.length - 1) {
        console.log('Step completed. Press Enter to continue, or Ctrl+C to stop...');
        await new Promise<void>((resolve) => {
          const readline = require('readline');
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
          rl.question('', () => {
            rl.close();
            resolve();
          });
        });
      }
    }

    success('SPARC workflow completed!');
  } catch (err) {
    error(`Failed to run workflow: ${(err as Error).message}`);
  }
}
