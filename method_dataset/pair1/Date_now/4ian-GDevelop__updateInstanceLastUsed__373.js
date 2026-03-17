const updateInstanceLastUsed = async (instanceId: string) => {
  try {
    const db = await openBrowserSWPreviewIndexedDB();
    const transaction = db.transaction(INSTANCES_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(INSTANCES_STORE_NAME);
    store.put({ lastUsed: Date.now() }, instanceId);
    await transactionToPromise(transaction);
  } catch (error) {
    console.error(
      '[BrowserSWIndexedDB] Failed to update instance heartbeat:',
      instanceId,
      error
    );
  }
};
