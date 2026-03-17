export async function runClaudeWithTelemetry(args, options = {}) {
  const sessionId = options.sessionId || `claude-${Date.now()}`;
  const agentType = options.agentType || 'claude-cli';
  const command = args.join(' ');
  
  // Enable telemetry environment variables
  const env = {
    ...process.env,
    CLAUDE_CODE_ENABLE_TELEMETRY: '1',
    OTEL_METRICS_EXPORTER: process.env.OTEL_METRICS_EXPORTER || 'console',
    OTEL_LOGS_EXPORTER: process.env.OTEL_LOGS_EXPORTER || 'console',
  };
  
  return new Promise((resolve, reject) => {
    const claude = spawn('claude', args, {
      env,
      stdio: ['inherit', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    // Create readline interface for real-time output
    const rlOut = readline.createInterface({
      input: claude.stdout,
      terminal: false
    });
    
    const rlErr = readline.createInterface({
      input: claude.stderr,
      terminal: false
    });
    
    rlOut.on('line', (line) => {
      console.log(line);
      stdout += line + '\n';
      
      // Look for token usage in real-time
      const usage = parseClaudeOutput(line);
      if (usage.tokens.input > 0 || usage.tokens.output > 0) {
        trackTokens({
          sessionId,
          agentType,
          command,
          inputTokens: usage.tokens.input,
          outputTokens: usage.tokens.output,
          metadata: { costs: usage.costs }
        }).catch(console.error);
      }
    });
    
    rlErr.on('line', (line) => {
      console.error(line);
      stderr += line + '\n';
    });
    
    claude.on('exit', async (code) => {
      // Try to parse session data after completion
      const sessionData = await parseClaudeSessionData(sessionId);
      if (sessionData) {
        await trackTokens({
          sessionId,
          agentType,
          command,
          inputTokens: sessionData.inputTokens,
          outputTokens: sessionData.outputTokens,
          metadata: { source: 'session_file' }
        });
      }
      
      // Also parse full output for any missed tokens
      const fullUsage = parseClaudeOutput(stdout + stderr);
      if (fullUsage.tokens.input > 0 || fullUsage.tokens.output > 0) {
        await trackTokens({
          sessionId,
          agentType,
          command,
          inputTokens: fullUsage.tokens.input,
          outputTokens: fullUsage.tokens.output,
          metadata: { source: 'output_parse', costs: fullUsage.costs }
        });
      }
      
      resolve({ code, stdout, stderr });
    });
    
    claude.on('error', reject);
  });
}
