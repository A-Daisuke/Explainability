async function processVerification(id) {
  const verification = verificationStore.verifications.get(id);
  if (!verification) return;
  
  try {
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    // Random result for demo
    const success = Math.random() > 0.2;
    const confidence = success ? Math.random() * 0.4 + 0.6 : Math.random() * 0.4;
    
    verification.status = success ? 'verified' : 'failed';
    verification.confidence = confidence;
    verification.completed_at = Date.now();
    
    verificationStore.metrics.pendingVerifications--;
    if (success) {
      verificationStore.metrics.successfulVerifications++;
    } else {
      verificationStore.metrics.failedVerifications++;
    }
    
    logEvent({
      type: 'verification_complete',
      verification_id: id,
      status: verification.status,
      confidence: verification.confidence,
      timestamp: Date.now(),
    });
    
  } catch (error) {
    verification.status = 'failed';
    verification.error = error.message;
    verification.completed_at = Date.now();
    
    verificationStore.metrics.pendingVerifications--;
    verificationStore.metrics.failedVerifications++;
    
    logEvent({
      type: 'error',
      verification_id: id,
      error: error.message,
      timestamp: Date.now(),
    });
  }
}
