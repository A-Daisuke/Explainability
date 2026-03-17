function __method_wrapper__() {
test('SqliteCacheStore maxEntries', { skip: runtimeFeatures.has('sqlite') === false }, async () => {
  const SqliteCacheStore = require('../../lib/cache/sqlite-cache-store.js')

  const store = new SqliteCacheStore({
    maxCount: 10
  })

  for (let i = 0; i < 20; i++) {
    /**
     * @type {import('../../types/cache-interceptor.d.ts').default.CacheKey}
     */
    const key = {
      origin: 'localhost',
      path: '/' + i,
      method: 'GET',
      headers: {}
    }

    /**
     * @type {import('../../types/cache-interceptor.d.ts').default.CacheValue}
     */
    const value = {
      statusCode: 200,
      statusMessage: '',
      headers: { foo: 'bar' },
      cachedAt: Date.now(),
      staleAt: Date.now() + 10000,
      deleteAt: Date.now() + 20000
    }

    const body = ['asd', '123']

    const writable = store.createWriteStream(key, value)
    notEqual(writable, undefined)
    writeBody(writable, body)
  }

  strictEqual(store.size <= 11, true)
})

}
