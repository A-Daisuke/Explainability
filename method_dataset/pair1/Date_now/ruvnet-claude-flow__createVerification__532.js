function createVerification(input) {
  const id = nanoid();
  const verification = {
    id,
    timestamp: Date.now(),
    status: 'PENDING',
    confidence: 0,
    source: input.source,
    target: input.target,
    metadata: input.metadata || {},
    priority: input.priority || 'NORMAL',
    timeout: input.timeout || 30000,
    createdAt: Date.now(),
  };
  
  dataStore.verifications.set(id, verification);
  dataStore.metrics.totalVerifications++;
  dataStore.metrics.pendingVerifications++;
  
  // Log event
  logEvent({
    type: 'VERIFICATION_COMPLETE',
    verificationId: id,
    data: { created: true },
    source: input.source,
    confidence: 1.0,
  });
  
  return verification;
}
