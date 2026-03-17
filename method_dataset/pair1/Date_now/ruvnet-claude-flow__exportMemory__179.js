async function exportMemory(subArgs, loadMemory, namespace) {
  const filename = subArgs[1] || `memory-export-${Date.now()}.json`;

  try {
    const data = await loadMemory();

    let exportData = data;
    if (namespace) {
      exportData = { [namespace]: data[namespace] || [] };
    }

    await fs.writeFile(filename, JSON.stringify(exportData, null, 2, 'utf8'));
    printSuccess(`Memory exported to ${filename}`);

    let totalEntries = 0;
    for (const entries of Object.values(exportData)) {
      totalEntries += entries.length;
    }
    console.log(
      `📦 Exported ${totalEntries} entries from ${Object.keys(exportData).length} namespace(s)`,
    );
  } catch (err) {
    printError(`Failed to export memory: ${err.message}`);
  }
}
