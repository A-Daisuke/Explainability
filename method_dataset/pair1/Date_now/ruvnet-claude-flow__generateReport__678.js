  function generateReport(
    agent: MockAgent,
    taskId: string,
    scenario: {
      actualOutcome: TaskOutcome;
      claimedOutcome: TaskOutcome;
      evidence?: any;
      timestamp?: number;
    }
  ): AgentReport {
    const reportId = `report-${Date.now()}-${Math.random()}`;
    
    // Apply agent's deception strategy
    const modifiedClaim = applyDeceptionStrategy(agent, scenario.claimedOutcome);
    
    // Generate evidence based on agent's behavior pattern
    const evidence = generateEvidence(agent, scenario.actualOutcome, modifiedClaim, scenario.evidence);

    return {
      id: reportId,
      agentId: agent.id,
      taskId,
      claimedOutcome: modifiedClaim,
      evidence,
      timestamp: scenario.timestamp || Date.now(),
      verified: false,
      conflicts: []
    };
  }
