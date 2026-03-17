class __C__ {
  async saveCache(fs: MemoryFS) {
    const files = (await fs.readdir(YARN_CACHE_DIR)).map(name => [
      name,
      fs.readFileSync(YARN_CACHE_DIR + '/' + name),
    ]);

    const db = await getDB();
    let time = Date.now();
    await db.clear(IDB_STORE_CACHE);
    {
      const tx = db.transaction(IDB_STORE_CACHE, 'readwrite');
      // await tx.store.clear();
      await Promise.all([
        ...files.map(([name, data]) =>
          tx.store.put({
            name,
            lastUsed: time,
            data,
          }),
        ),
        tx.done,
      ]);
    }
    // {
    //   const tx = db.transaction(IDB_STORE_CACHE, 'readwrite');
    //   let oldEntries = await (await tx.store.index('lastUsed')).getAll(
    //     // $FlowFixMe
    //     IDBKeyRange.upperBound(time - YARN_CACHE_STALE),
    //   );
    //   if (oldEntries.length > 0) {
    //     console.log(`Purging cache, deleting ${oldEntries.length} packages`);
    //   }
    //   await Promise.all([
    //     ...oldEntries.map(({name}) => tx.store.delete(name)),
    //     tx.done,
    //   ]);
    // }
  },

}
