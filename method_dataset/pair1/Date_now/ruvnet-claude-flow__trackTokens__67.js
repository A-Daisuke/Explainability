export async function trackTokens(params) {
  const {
    sessionId,
    agentType = 'general',
    command = 'unknown',
    inputTokens = 0,
    outputTokens = 0,
    metadata = {}
  } = params;
  
  // Update totals
  tokenCache.totals.input += inputTokens;
  tokenCache.totals.output += outputTokens;
  tokenCache.totals.total += (inputTokens + outputTokens);
  
  // Track by agent type
  if (!tokenCache.byAgent[agentType]) {
    tokenCache.byAgent[agentType] = {
      input: 0,
      output: 0,
      total: 0,
      count: 0
    };
  }
  tokenCache.byAgent[agentType].input += inputTokens;
  tokenCache.byAgent[agentType].output += outputTokens;
  tokenCache.byAgent[agentType].total += (inputTokens + outputTokens);
  tokenCache.byAgent[agentType].count++;
  
  // Track by command
  if (!tokenCache.byCommand[command]) {
    tokenCache.byCommand[command] = {
      input: 0,
      output: 0,
      total: 0,
      count: 0
    };
  }
  tokenCache.byCommand[command].input += inputTokens;
  tokenCache.byCommand[command].output += outputTokens;
  tokenCache.byCommand[command].total += (inputTokens + outputTokens);
  tokenCache.byCommand[command].count++;
  
  // Add to history
  tokenCache.history.push({
    timestamp: Date.now(),
    sessionId,
    agentType,
    command,
    inputTokens,
    outputTokens,
    metadata
  });
  
  // Keep only last 1000 entries in history
  if (tokenCache.history.length > 1000) {
    tokenCache.history = tokenCache.history.slice(-1000);
  }
  
  // Save to disk
  await saveTokenData();
  
  return {
    sessionTotal: inputTokens + outputTokens,
    grandTotal: tokenCache.totals.total
  };
}
