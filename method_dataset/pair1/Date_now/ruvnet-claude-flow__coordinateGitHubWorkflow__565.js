export async function coordinateGitHubWorkflow(args, flags = {}) {
  const coordinator = new GitHubCoordinator();

  try {
    await coordinator.initialize(flags);

    const objective = args.join(' ').trim();

    if (objective.includes('CI/CD') || objective.includes('pipeline')) {
      return await coordinator.coordinateCIPipeline(flags);
    } else if (objective.includes('release')) {
      return await coordinator.coordinateRelease(flags);
    } else {
      // General coordination
      printInfo(`🎯 Coordinating: ${objective}`);

      const coordinationPlan = {
        id: `general-${Date.now()}`,
        type: 'general_coordination',
        objective,
        steps: ['analyze_requirements', 'create_action_plan', 'execute_plan'],
        status: 'planning',
      };

      coordinator.activeCoordinations.set(coordinationPlan.id, coordinationPlan);

      if (coordinator.swarmEnabled) {
        await coordinator.executeWithSwarm(coordinationPlan);
      } else {
        await coordinator.executeCoordination(coordinationPlan);
      }

      return coordinationPlan;
    }
  } catch (error) {
    printError(`❌ GitHub coordination failed: ${error.message}`);
    throw error;
  }
}
