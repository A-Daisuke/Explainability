function __method_wrapper__() {
test('isFull returns true when maxCount reached', async () => {
  const maxCount = 2
  const store = new MemoryCacheStore({ maxCount })

  // Add maxCount + 1 entries
  for (let i = 0; i <= maxCount; i++) {
    const writeStream = store.createWriteStream(
      { origin: 'test', path: `/${i}`, method: 'GET' },
      {
        statusCode: 200,
        statusMessage: 'OK',
        headers: {},
        cachedAt: Date.now(),
        staleAt: Date.now() + 1000,
        deleteAt: Date.now() + 2000
      }
    )
    writeStream.end('test')
  }

  equal(store.isFull(), true, 'Should be full when maxCount exceeded')
})

}
