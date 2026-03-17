async function exampleToolTracking() {
  console.log('\n=== Tool Usage Tracking ===');

  const startTime = Date.now();

  // Track a successful tool usage
  await enhancedMemory.trackToolUsage(
    'memory_usage',
    { action: 'store', key: 'test', value: 'data' },
    { success: true, stored: true },
    Date.now() - startTime,
    true,
  );

  // Track a failed tool usage
  await enhancedMemory.trackToolUsage(
    'swarm_init',
    { topology: 'invalid' },
    null,
    150,
    false,
    'Invalid topology specified',
  );

  // Get tool statistics
  const stats = await enhancedMemory.getToolStats();
  console.log('Tool effectiveness:', stats);
}
