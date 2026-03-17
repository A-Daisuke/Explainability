async function storeCommand(args: string[], flags: Record<string, any>): Promise<void> {
  const key = args[0];
  const value = args.slice(1).join(' ');

  if (!key || !value) {
    printError('Usage: memory store <key> <value> [options]');
    console.log('Options:');
    console.log('  --namespace <namespace> Target namespace (default: default)');
    console.log('  --type <type>           Data type');
    console.log('  --tags <tags>           Tags (comma-separated)');
    console.log('  --owner <owner>         Entry owner (default: system)');
    console.log('  --access-level <level>  Access level (private|shared|public, default: shared)');
    console.log('  --ttl <ms>              Time-to-live in milliseconds');
    console.log('  --compress              Force compression');
    return;
  }

  try {
    const manager = await ensureMemoryManager();

    // Parse value as JSON if possible
    let parsedValue;
    try {
      parsedValue = JSON.parse(value);
    } catch {
      parsedValue = value;
    }

    const entryId = await manager.store(key, parsedValue, {
      namespace: flags.namespace || 'default',
      type: flags.type,
      tags: flags.tags ? flags.tags.split(',').map((t: string) => t.trim()) : undefined,
      owner: flags.owner || 'system',
      accessLevel: flags['access-level'] || 'shared',
      ttl: flags.ttl ? parseInt(flags.ttl) : undefined,
      compress: flags.compress,
    });

    printSuccess('Entry stored successfully');
    console.log(`📝 Entry ID: ${entryId}`);
    console.log(`🔑 Key: ${key}`);
    console.log(`📦 Namespace: ${flags.namespace || 'default'}`);
    console.log(`🏷️  Type: ${flags.type || 'auto-detected'}`);

    if (flags.tags) {
      console.log(`🏷️  Tags: [${flags.tags}]`);
    }
    if (flags.ttl) {
      const expiresAt = new Date(Date.now() + parseInt(flags.ttl));
      console.log(`⏰ Expires: ${expiresAt.toLocaleString()}`);
    }
  } catch (error) {
    printError(`Store failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
