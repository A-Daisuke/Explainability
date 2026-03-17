async function updateAccessPattern(
  namespace: string,
  key: string,
  context: AgenticHookContext
): Promise<void> {
  // Track access patterns for optimization
  const patternKey = `pattern:${namespace}:${key}`;
  const pattern = await context.memory.cache.get(patternKey) || {
    accesses: [],
    lastAccess: 0,
  };
  
  pattern.accesses.push(Date.now());
  pattern.lastAccess = Date.now();
  
  // Keep last 100 accesses
  if (pattern.accesses.length > 100) {
    pattern.accesses = pattern.accesses.slice(-100);
  }
  
  await context.memory.cache.set(patternKey, pattern);
}
