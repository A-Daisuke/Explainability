async function exampleSessionManagement() {
  console.log('\n=== Session Management ===');

  // Save current session state
  const sessionId = `session-${Date.now()}`;
  await enhancedMemory.saveSessionState(sessionId, {
    state: 'active',
    context: {
      currentTask: 'Implementing authentication',
      openFiles: ['src/auth.js', 'src/middleware/auth.js'],
      cursorPositions: { 'src/auth.js': { line: 45, column: 12 } },
      activeAgents: ['AuthExpert', 'SecurityReviewer'],
      completedSteps: ['Design API', 'Create models'],
      nextSteps: ['Implement JWT', 'Add tests'],
    },
  });

  console.log('Session saved:', sessionId);

  // Later, resume the session
  const resumed = await enhancedMemory.resumeSession(sessionId);
  console.log('Resumed context:', resumed.context);
}
