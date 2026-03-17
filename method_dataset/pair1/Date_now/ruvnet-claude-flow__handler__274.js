function __method_wrapper__() {
  handler: async (
    payload: MemoryHookPayload,
    context: AgenticHookContext
  ): Promise<HookHandlerResult> => {
    const { operation, namespace, provider, syncTargets } = payload;
    
    const sideEffects: SideEffect[] = [];
    
    switch (operation) {
      case 'sync':
        // Bidirectional sync
        const changes = await detectMemoryChanges(namespace, provider, context);
        
        if (changes.length > 0) {
          sideEffects.push({
            type: 'log',
            action: 'write',
            data: {
              level: 'info',
              message: `Syncing ${changes.length} memory changes`,
              data: { namespace, provider, targets: syncTargets },
            },
          });
          
          // Apply changes
          for (const change of changes) {
            await applyMemoryChange(change, syncTargets || [], context);
          }
          
          sideEffects.push({
            type: 'metric',
            action: 'update',
            data: {
              name: 'memory.sync.changes',
              value: changes.length,
            },
          });
        }
        break;
        
      case 'persist':
        // Persist to long-term storage
        const snapshot = await createMemorySnapshot(namespace, context);
        
        sideEffects.push({
          type: 'memory',
          action: 'store',
          data: {
            key: `snapshot:${namespace}:${Date.now()}`,
            value: snapshot,
            ttl: 0, // No expiration
          },
        });
        
        sideEffects.push({
          type: 'notification',
          action: 'emit',
          data: {
            event: 'memory:persisted',
            data: { namespace, size: snapshot.size },
          },
        });
        break;
        
      case 'expire':
        // Clean up expired entries
        const expired = await findExpiredEntries(namespace, context);
        
        if (expired.length > 0) {
          for (const key of expired) {
            await removeMemoryEntry(namespace, key, context);
          }
          
          sideEffects.push({
            type: 'metric',
            action: 'update',
            data: {
              name: 'memory.expired',
              value: expired.length,
            },
          });
        }
        break;
    }
    
    return {
      continue: true,
      sideEffects,
    };
  },

}
