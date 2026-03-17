async function updateProviderHealth(
  provider: string,
  health: number,
  context: AgenticHookContext
): Promise<void> {
  // Update provider health in memory
  const healthKey = `provider:health:${provider}`;
  const currentHealth = await context.memory.cache.get(healthKey) || [];
  
  currentHealth.push({
    timestamp: Date.now(),
    health,
  });
  
  // Keep last 100 health checks
  if (currentHealth.length > 100) {
    currentHealth.shift();
  }
  
  await context.memory.cache.set(healthKey, currentHealth);
}
