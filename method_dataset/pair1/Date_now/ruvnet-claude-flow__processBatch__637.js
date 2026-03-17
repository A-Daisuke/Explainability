async function processBatch(batchId) {
  const batch = dataStore.batches.get(batchId);
  if (!batch) return;
  
  batch.status = 'PROCESSING';
  
  try {
    for (const item of batch.items) {
      await processVerification(item.id);
      batch.completedItems++;
      batch.results.push(dataStore.verifications.get(item.id));
    }
    
    batch.status = 'COMPLETED';
    batch.completedAt = Date.now();
    
  } catch (error) {
    batch.status = 'FAILED';
    batch.error = error.message;
    batch.completedAt = Date.now();
  }
}
