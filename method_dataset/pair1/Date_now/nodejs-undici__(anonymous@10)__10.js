function __method_wrapper__() {
test('default limits prevent memory leaks', async () => {
  const store = new MemoryCacheStore() // Uses new defaults

  // Test that maxCount default (1024) is enforced
  for (let i = 0; i < 1025; i++) {
    const writeStream = store.createWriteStream(
      { origin: 'test', path: `/test-${i}`, method: 'GET' },
      {
        statusCode: 200,
        statusMessage: 'OK',
        headers: {},
        cachedAt: Date.now(),
        staleAt: Date.now() + 60000,
        deleteAt: Date.now() + 120000
      }
    )
    writeStream.write('test data')
    writeStream.end()
  }

  // Should be full after exceeding maxCount default of 1024
  equal(store.isFull(), true, 'Store should be full after exceeding maxCount default')
})

}
