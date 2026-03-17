async function sessionRestoreCommand(subArgs, flags) {
  const options = flags;
  const sessionId = options['session-id'] || 'latest';

  console.log(`🔄 Executing session-restore hook...`);
  console.log(`🆔 Session: ${sessionId}`);

  try {
    const store = await getMemoryStore();

    // Find session to restore
    let sessionData;
    if (sessionId === 'latest') {
      const sessions = await store.list({ namespace: 'sessions', limit: 1 });
      sessionData = sessions[0]?.value;
    } else {
      sessionData = await store.retrieve(`session:${sessionId}`, { namespace: 'sessions' });
    }

    if (sessionData) {
      console.log(`\n📊 RESTORED SESSION:`);
      console.log(`  🆔 ID: ${sessionData.sessionId || 'unknown'}`);
      console.log(`  📋 Tasks: ${sessionData.totalTasks || 0}`);
      console.log(`  ✏️  Edits: ${sessionData.totalEdits || 0}`);
      console.log(`  ⏰ Ended: ${sessionData.endedAt || 'unknown'}`);

      // Store restoration event
      await store.store(
        `session-restore:${Date.now()}`,
        {
          restoredSessionId: sessionData.sessionId || sessionId,
          restoredAt: new Date().toISOString(),
        },
        { namespace: 'session-events' },
      );

      console.log(`  💾 Session restored from .swarm/memory.db`);
      printSuccess(`✅ Session restore completed`);
    } else {
      printWarning(`No session found with ID: ${sessionId}`);
    }
  } catch (err) {
    printError(`Session restore hook failed: ${err.message}`);
  }
}
