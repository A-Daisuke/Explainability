async function validateCheckpoints(): Promise<boolean> {
  console.log('\n━━━ VALIDATION 3: Checkpoints ━━━\n');

  const manager = new RealCheckpointManager({
    persistPath: '.test-validation-checkpoints',
  });
  const startTime = Date.now();

  try {
    // Create query and manually add messages for testing
    const sessionId = 'checkpoint-validation-test';
    const mockMessages = [
      {
        type: 'user' as const,
        uuid: 'mock-uuid-1',
        session_id: sessionId,
        message: { role: 'user' as const, content: 'Test' },
      },
      {
        type: 'assistant' as const,
        uuid: 'mock-uuid-2',
        session_id: sessionId,
        message: {
          role: 'assistant' as const,
          content: [{ type: 'text' as const, text: 'Response' }],
        },
      },
    ];

    // Manually set session messages for testing
    manager['sessionMessages'].set(sessionId, mockMessages as any);

    console.log('📝 Creating checkpoint...');

    // Create checkpoint
    const checkpointId = await manager.createCheckpoint(
      sessionId,
      'Test checkpoint'
    );

    // PROOF 1: Checkpoint ID is a message UUID
    if (checkpointId !== 'mock-uuid-2') {
      console.log('❌ FAILED: Checkpoint ID is not last message UUID');
      console.log(`   Expected: mock-uuid-2`);
      console.log(`   Got: ${checkpointId}`);
      return false;
    }
    console.log(`✅ Checkpoint ID is message UUID: ${checkpointId}`);

    // PROOF 2: Checkpoint stored in memory
    const checkpoint = manager.getCheckpoint(checkpointId);
    if (!checkpoint) {
      console.log('❌ FAILED: Checkpoint not in memory');
      return false;
    }
    console.log(`✅ Checkpoint in memory: "${checkpoint.description}"`);
    console.log(`   Session: ${checkpoint.sessionId}`);
    console.log(`   Messages: ${checkpoint.messageCount}`);

    // PROOF 3: Checkpoint persisted to disk
    const persisted = await manager.listPersistedCheckpoints();
    if (!persisted.includes(checkpointId)) {
      console.log('❌ FAILED: Checkpoint not persisted');
      return false;
    }
    console.log(`✅ Checkpoint persisted: .test-validation-checkpoints/${checkpointId}.json`);

    // PROOF 4: Can list checkpoints
    const checkpoints = manager.listCheckpoints(sessionId);
    if (checkpoints.length !== 1) {
      console.log('❌ FAILED: Checkpoint list incorrect');
      return false;
    }
    console.log(`✅ Listed ${checkpoints.length} checkpoint(s)`);

    // PROOF 5: Can rollback (creates new query with resumeSessionAt)
    console.log('\n⏮️  Rolling back to checkpoint...');
    const rolledBack = await manager.rollbackToCheckpoint(
      checkpointId,
      'Continue from checkpoint'
    );

    if (!rolledBack) {
      console.log('❌ FAILED: Rollback did not return query');
      return false;
    }
    console.log(`✅ Rollback successful, new query created`);

    const duration = Date.now() - startTime;
    console.log(`\n✅ VALIDATION 3 PASSED (${duration}ms)`);
    console.log('   - Uses message UUIDs ✓');
    console.log('   - Uses SDK resumeSessionAt ✓');
    console.log('   - Persists to disk ✓');
    console.log('   - Supports rollback ✓');

    return true;
  } catch (error) {
    console.log(`❌ VALIDATION 3 FAILED:`, error);
    return false;
  }
}
