async function storeMemory(subArgs, loadMemory, saveMemory, namespace) {
  const key = subArgs[1];
  const value = subArgs.slice(2).join(' ');

  if (!key || !value) {
    printError('Usage: memory store <key> <value> [--namespace <ns>]');
    return;
  }

  try {
    const data = await loadMemory();

    if (!data[namespace]) {
      data[namespace] = [];
    }

    // Remove existing entry with same key
    data[namespace] = data[namespace].filter((e) => e.key !== key);

    // Add new entry
    data[namespace].push({
      key,
      value,
      namespace,
      timestamp: Date.now(),
    });

    await saveMemory(data);
    printSuccess('Stored successfully');
    console.log(`📝 Key: ${key}`);
    console.log(`📦 Namespace: ${namespace}`);
    console.log(`💾 Size: ${new TextEncoder().encode(value).length} bytes`);
  } catch (err) {
    printError(`Failed to store: ${err.message}`);
  }
}
