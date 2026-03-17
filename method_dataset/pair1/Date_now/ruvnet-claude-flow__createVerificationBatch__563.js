function createVerificationBatch(input) {
  const id = nanoid();
  const batch = {
    id,
    status: 'PENDING',
    createdAt: Date.now(),
    totalItems: input.items.length,
    completedItems: 0,
    items: input.items.map(item => createVerification(item)),
    results: [],
  };
  
  // Set batch reference on items
  batch.items.forEach(item => {
    item.batchId = id;
  });
  
  dataStore.batches.set(id, batch);
  
  return batch;
}
