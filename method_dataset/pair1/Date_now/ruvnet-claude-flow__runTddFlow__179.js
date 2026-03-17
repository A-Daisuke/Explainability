async function runTddFlow(ctx: CommandContext): Promise<void> {
  const taskDescription = ctx.args.slice(1).join(' ');

  if (!taskDescription) {
    error('Usage: sparc tdd <task-description>');
    return;
  }

  try {
    const config = await loadSparcConfig();

    // Build TDD workflow using SPARC methodology
    const workflow = [
      {
        mode: 'spec-pseudocode',
        phase: 'Specification',
        description: `Create detailed spec and pseudocode for: ${taskDescription}`,
      },
      { mode: 'tdd', phase: 'Red', description: `Write failing tests for: ${taskDescription}` },
      {
        mode: 'code',
        phase: 'Green',
        description: `Implement minimal code to pass tests for: ${taskDescription}`,
      },
      {
        mode: 'refinement-optimization-mode',
        phase: 'Refactor',
        description: `Refactor and optimize implementation for: ${taskDescription}`,
      },
      {
        mode: 'integration',
        phase: 'Integration',
        description: `Integrate and verify complete solution for: ${taskDescription}`,
      },
    ];

    if (ctx.flags.dryRun || ctx.flags['dry-run']) {
      warning('DRY RUN - TDD Workflow:');
      for (const step of workflow) {
        console.log(`${cyan(step.phase)}: ${step.mode} - ${step.description}`);
      }
      return;
    }

    success('Starting SPARC TDD Workflow');
    console.log('Following Test-Driven Development with SPARC methodology');
    console.log();

    for (let i = 0; i < workflow.length; i++) {
      const step = workflow[i];
      const mode = config.customModes.find((m) => m.slug === step.mode);

      if (!mode) {
        warning(`Mode not found: ${step.mode}, skipping step`);
        continue;
      }

      info(`Phase ${i + 1}/5: ${step.phase} (${mode.name})`);
      console.log(`📋 ${step.description}`);
      console.log();

      const enhancedTask = buildSparcPrompt(mode, step.description, {
        ...ctx.flags,
        tddPhase: step.phase,
        workflowStep: i + 1,
        totalSteps: workflow.length,
      });

      const tools = buildToolsFromGroups(mode.groups);
      const instanceId = `sparc-tdd-${step.phase.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

      await executeClaudeWithSparc(enhancedTask, tools, instanceId, ctx.flags);

      // Store phase completion in memory for next step
      if (ctx.flags.sequential !== false) {
        console.log('Phase completed. Press Enter to continue to next phase, or Ctrl+C to stop...');
        await new Promise<void>(async (resolve) => {
          const readline = await import('readline');
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

    success('SPARC TDD Workflow completed!');
  } catch (err) {
    error(`Failed to run TDD flow: ${(err as Error).message}`);
  }
}
