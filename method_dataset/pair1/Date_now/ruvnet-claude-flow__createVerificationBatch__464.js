function createVerificationBatch(items) {
  const id = nanoid();
  const batch = {
    id,
    items,
    status: 'pending',
    created_at: Date.now(),
    total_items: items.length,
    completed_items: 0,
  };
  
  verificationStore.batches.set(id, batch);
  
  logEvent({
    type: 'batch_created',
    batch_id: id,
    item_count: items.length,
    timestamp: Date.now(),
  });
  
  return batch;
}
