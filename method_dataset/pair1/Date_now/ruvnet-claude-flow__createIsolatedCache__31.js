export function createIsolatedCache() {
  // Create unique cache directory for this process
  const timestamp = Date.now();
  const pid = process.pid;
  const random = Math.random().toString(36).substring(2, 8);
  const cacheName = `claude-flow-${pid}-${timestamp}-${random}`;
  const cacheDir = path.join(os.tmpdir(), '.npm-cache', cacheName);

  // Track for cleanup
  cacheDirectories.add(cacheDir);

  // Register cleanup on first use
  if (!cleanupRegistered) {
    registerCleanup();
    cleanupRegistered = true;
  }

  // Return environment with isolated cache
  // Use Deno.env if available (Deno environment), otherwise use process.env (Node.js environment)
  const baseEnv = typeof Deno !== 'undefined' && Deno.env ? Deno.env.toObject() : process.env;

  return {
    ...baseEnv,
    NPM_CONFIG_CACHE: cacheDir,
    // Also set npm cache for older npm versions
    npm_config_cache: cacheDir,
  };
}
