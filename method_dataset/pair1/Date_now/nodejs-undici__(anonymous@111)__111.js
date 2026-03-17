function __method_wrapper__() {
    test('returns stale response before deleteAt', options, async () => {
      const clock = FakeTimers.install({
        shouldClearNativeTimers: true
      })

      after(() => clock.uninstall())

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
       * @type {import('../../types/cache-interceptor.d.ts').default.CacheValue}
       */
      const value = {
        statusCode: 200,
        statusMessage: '',
        headers: { foo: 'bar' },
        cacheControlDirectives: {},
        cachedAt: Date.now(),
        staleAt: Date.now() + 1000,
        // deleteAt is different because stale-while-revalidate, stale-if-error, ...
        deleteAt: Date.now() + 5000
      }

      const body = [Buffer.from('asd'), Buffer.from('123')]

      const store = new CacheStore()

      // Sanity check
      equal(store.get(key), undefined)

      {
        const writable = store.createWriteStream(key, value)
        notEqual(writable, undefined)
        writeBody(writable, body)
      }

      clock.tick(1500)

      {
        const result = await store.get(structuredClone(key))
        notEqual(result, undefined)
        await compareGetResults(result, value, body)
      }

      clock.tick(6000)

      // Past deleteAt, shouldn't be returned
      equal(await store.get(key), undefined)
    })

}
