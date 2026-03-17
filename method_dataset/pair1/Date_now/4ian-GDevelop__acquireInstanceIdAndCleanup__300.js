const acquireInstanceIdAndCleanup = async (
  cleanInstanceRelatedFiles: (instanceId: string) => Promise<void>
) => {
  const db = await openBrowserSWPreviewIndexedDB();
  const now = Date.now();
  const expiredInstanceIds: Array<string> = [];
  let acquiredInstanceId: ?string = null;

  // First transaction: identify expired instances and acquire new ID
  const transaction = db.transaction(INSTANCES_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(INSTANCES_STORE_NAME);

  const [keys, records] = await Promise.all([
    // $FlowFixMe - outdated Flow types.
    requestToPromise(store.getAllKeys()),
    // $FlowFixMe - outdated Flow types.
    requestToPromise(store.getAll()),
  ]);

  const usedIds: Array<number> = [];

  keys.forEach((key, index) => {
    if (typeof key !== 'string') return;
    const record = records[index];
    const lastUsed =
      record && typeof record.lastUsed === 'number' ? record.lastUsed : 0;

    if (now - lastUsed > INSTANCE_CLEANUP_THRESHOLD_MS) {
      expiredInstanceIds.push(key);
      return;
    }

    const parsedId = parseInt(key, 10);
    if (!isNaN(parsedId)) {
      usedIds.push(parsedId);
    }
  });

  const newId = findUnusedInstanceId(usedIds);
  acquiredInstanceId = String(newId);
  store.put({ lastUsed: now }, acquiredInstanceId);

  await transactionToPromise(transaction);

  // Clean up expired instances one by one: only delete instance record if cleanup succeeds
  for (const expiredId of expiredInstanceIds) {
    try {
      console.log(
        `[BrowserSWIndexedDB] Cleaning up expired instance #${expiredId} files...`
      );
      await cleanInstanceRelatedFiles(expiredId);

      // Only delete the instance record if the cleanup succeeds.
      const cleanupTransaction = db.transaction(
        INSTANCES_STORE_NAME,
        'readwrite'
      );
      const cleanupStore = cleanupTransaction.objectStore(INSTANCES_STORE_NAME);
      cleanupStore.delete(expiredId);
      await transactionToPromise(cleanupTransaction);
    } catch (error) {
      console.error(
        '[BrowserSWIndexedDB] Failed to clean up expired instance, keeping instance record:',
        expiredId,
        error
      );
      // Continue with next instance - we still want to clean up what we can
    }
  }

  return acquiredInstanceId;
};
