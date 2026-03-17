function __method_wrapper__() {
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

}
