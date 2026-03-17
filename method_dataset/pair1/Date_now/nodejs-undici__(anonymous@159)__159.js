function __method_wrapper__() {
test('SqliteCacheStore write & read', { skip: runtimeFeatures.has('sqlite') === false }, async () => {
  const SqliteCacheStore = require('../../lib/cache/sqlite-cache-store.js')

  const store = new SqliteCacheStore({
    maxCount: 10
  })

  /**
   * @type {import('../../types/cache-interceptor.d.ts').default.CacheKey}
   */
  const key = {
    origin: 'localhost',
    path: '/',
    method: 'GET',
    headers: {}
  }

  /**
   * @type {import('../../types/cache-interceptor.d.ts').default.CacheValue & { body: Buffer }}
   */
  const value = {
    statusCode: 200,
    statusMessage: '',
    headers: { foo: 'bar' },
    cacheControlDirectives: { 'max-stale': 0 },
    cachedAt: Date.now(),
    staleAt: Date.now() + 10000,
    deleteAt: Date.now() + 20000,
    body: Buffer.from('asd'),
    etag: undefined,
    vary: undefined
  }

  store.set(key, value)

  deepStrictEqual(store.get(key), value)
})

}
