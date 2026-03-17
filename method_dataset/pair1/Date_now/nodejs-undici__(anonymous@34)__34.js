function __method_wrapper__() {
test('default maxEntrySize prevents large entries', async () => {
  const store = new MemoryCacheStore() // Uses new defaults

  // Create entry larger than default maxEntrySize (5MB)
  const largeData = Buffer.allocUnsafe(5242881) // 5MB + 1 byte

  const writeStream = store.createWriteStream(
    { origin: 'test', path: '/large', method: 'GET' },
    {
      statusCode: 200,
      statusMessage: 'OK',
      headers: {},
      cachedAt: Date.now(),
      staleAt: Date.now() + 60000,
      deleteAt: Date.now() + 120000
    }
  )

  writeStream.write(largeData)
  writeStream.end()

  // Entry should not be cached due to maxEntrySize limit
  const result = store.get({ origin: 'test', path: '/large', method: 'GET', headers: {} })
  equal(result, undefined, 'Large entry should not be cached due to maxEntrySize limit')
})

}
