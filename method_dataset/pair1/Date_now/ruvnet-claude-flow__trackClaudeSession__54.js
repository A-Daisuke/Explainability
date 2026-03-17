export async function trackClaudeSession() {
  console.log('🔍 Claude token tracker started (running in background)');
  console.log('   Token usage will be saved to .claude-flow/metrics/token-usage.json');
  
  let totalInput = 0;
  let totalOutput = 0;
  let lastUpdate = Date.now();
  
  // Monitor Claude's telemetry output
  process.stdin.on('data', async (data) => {
    const output = data.toString();
    const tokens = parseTokensFromTelemetry(output);
    
    if (tokens && (tokens.inputTokens > 0 || tokens.outputTokens > 0)) {
      totalInput += tokens.inputTokens;
      totalOutput += tokens.outputTokens;
      
      // Track tokens
      await trackTokens({
        sessionId: `claude-session-${Date.now()}`,
        agentType: 'claude-cli',
        command: 'interactive',
        inputTokens: tokens.inputTokens,
        outputTokens: tokens.outputTokens,
        metadata: {
          source: 'telemetry_stream'
        }
      });
      
      // Show update every 10 seconds max
      if (Date.now() - lastUpdate > 10000) {
        console.log(`📊 Token Update: Input: ${totalInput}, Output: ${totalOutput}`);
        lastUpdate = Date.now();
      }
    }
  });
  
  // Handle shutdown
  process.on('SIGINT', () => {
    console.log(`\n📊 Session Total: Input: ${totalInput}, Output: ${totalOutput}`);
    console.log('✅ Token tracking data saved');
    process.exit(0);
  });
}
