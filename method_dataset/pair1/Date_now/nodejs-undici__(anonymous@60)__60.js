function __method_wrapper__() {
test('size getter returns correct total size', async () => {
  const store = new MemoryCacheStore()
  const testData = 'test data'

  equal(store.size, 0, 'Initial size should be 0')

  const writeStream = store.createWriteStream(
    { origin: 'test', path: '/', method: 'GET' },
    {
      statusCode: 200,
      statusMessage: 'OK',
      headers: {},
      cachedAt: Date.now(),
      staleAt: Date.now() + 1000,
      deleteAt: Date.now() + 2000
    }
  )

  writeStream.write(testData)
  writeStream.end()

  equal(store.size, testData.length, 'Size should match written data length')
})

}
