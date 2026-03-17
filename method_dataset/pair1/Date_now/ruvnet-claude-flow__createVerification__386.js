function createVerification(request) {
  const id = nanoid();
  const verification = {
    id,
    timestamp: Date.now(),
    status: 'pending',
    confidence: 0,
    source: request.source,
    target: request.target,
    metadata: request.metadata,
    priority: request.priority,
    timeout: request.timeout,
    created_at: Date.now(),
  };
  
  verificationStore.verifications.set(id, verification);
  verificationStore.metrics.totalVerifications++;
  verificationStore.metrics.pendingVerifications++;
  
  logEvent({
    type: 'verification_created',
    verification_id: id,
    source: request.source,
    target: request.target,
    timestamp: Date.now(),
  });
  
  return verification;
}
