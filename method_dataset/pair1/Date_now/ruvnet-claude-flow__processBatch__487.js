async function processBatch(batchId) {
  const batch = verificationStore.batches.get(batchId);
  if (!batch) return;
  
  batch.status = 'processing';
  batch.results = [];
  
  try {
    for (const item of batch.items) {
      const verification = createVerification(item);
      await processVerification(verification.id);
      batch.results.push(verificationStore.verifications.get(verification.id));
      batch.completed_items++;
    }
    
    batch.status = 'completed';
    batch.completed_at = Date.now();
    
    logEvent({
      type: 'batch_completed',
      batch_id: batchId,
      completed_items: batch.completed_items,
      timestamp: Date.now(),
    });
    
  } catch (error) {
    batch.status = 'failed';
    batch.error = error.message;
    batch.completed_at = Date.now();
    
    logEvent({
      type: 'error',
      batch_id: batchId,
      error: error.message,
      timestamp: Date.now(),
    });
  }
}
