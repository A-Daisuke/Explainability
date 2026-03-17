async function processVerification(id) {
  const verification = dataStore.verifications.get(id);
  if (!verification) return;
  
  try {
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    // Random result for demo
    const success = Math.random() > 0.2;
    const confidence = success ? Math.random() * 0.4 + 0.6 : Math.random() * 0.4;
    
    verification.status = success ? 'VERIFIED' : 'FAILED';
    verification.confidence = confidence;
    verification.completedAt = Date.now();
    verification.updatedAt = Date.now();
    
    dataStore.metrics.pendingVerifications--;
    if (success) {
      dataStore.metrics.successfulVerifications++;
    } else {
      dataStore.metrics.failedVerifications++;
    }
    
    // Log completion event
    logEvent({
      type: 'VERIFICATION_COMPLETE',
      verificationId: id,
      data: { status: verification.status, confidence },
      source: verification.source,
      confidence,
    });
    
  } catch (error) {
    verification.status = 'FAILED';
    verification.error = error.message;
    verification.completedAt = Date.now();
    verification.updatedAt = Date.now();
    
    dataStore.metrics.pendingVerifications--;
    dataStore.metrics.failedVerifications++;
    
    logEvent({
      type: 'ERROR',
      verificationId: id,
      data: { error: error.message },
      source: verification.source,
      confidence: 0,
    });
  }
}
