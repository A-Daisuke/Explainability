export async function trackAgentActivity(agentId, agentType, action, duration, success = true) {
  if (!metricsCache.agents[agentType]) {
    metricsCache.agents[agentType] = {
      total: 0,
      successful: 0,
      failed: 0,
      totalDuration: 0,
      actions: []
    };
  }
  
  const agent = metricsCache.agents[agentType];
  agent.total++;
  agent.totalDuration += duration;
  
  if (success) {
    agent.successful++;
  } else {
    agent.failed++;
  }
  
  agent.actions.push({
    id: agentId,
    action,
    duration,
    success,
    timestamp: Date.now()
  });
  
  // Keep only last 100 actions per agent type
  if (agent.actions.length > 100) {
    agent.actions = agent.actions.slice(-100);
  }
  
  metricsCache.performance.totalAgents = Object.keys(metricsCache.agents).length;
  
  await saveMetricsToDisk();
}
