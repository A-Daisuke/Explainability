function __method_wrapper__() {
    test('caches request', options, async () => {
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
        staleAt: Date.now() + 10000,
        deleteAt: Date.now() + 20000
      }

      const body = [Buffer.from('asd'), Buffer.from('123')]

      const store = new CacheStore()

      // Sanity check
      equal(await store.get(key), undefined)

      // Write response to store
      {
        const writable = store.createWriteStream(key, value)
        notEqual(writable, undefined)
        writeBody(writable, body)
      }

      // Now let's try fetching the response from the store
      {
        const result = await store.get(structuredClone(key))
        notEqual(result, undefined)
        await compareGetResults(result, value, body)
      }

      /**
       * Let's try out a request to a different resource to make sure it can
       *  differentiate between the two
       * @type {import('../../types/cache-interceptor.d.ts').default.CacheKey}
       */
      const anotherKey = {
        origin: 'localhost',
        path: '/asd',
        method: 'GET',
        headers: {}
      }

      /**
       * @type {import('../../types/cache-interceptor.d.ts').default.CacheValue}
       */
      const anotherValue = {
        statusCode: 200,
        statusMessage: '',
        headers: { foo: 'bar' },
        cacheControlDirectives: {},
        cachedAt: Date.now(),
        staleAt: Date.now() + 10000,
        deleteAt: Date.now() + 20000
      }

      const anotherBody = [Buffer.from('asd'), Buffer.from('123')]

      equal(store.get(anotherKey), undefined)

      {
        const writable = store.createWriteStream(anotherKey, anotherValue)
        notEqual(writable, undefined)
        writeBody(writable, anotherBody)
      }

      {
        const result = await store.get(structuredClone(anotherKey))
        notEqual(result, undefined)
        await compareGetResults(result, anotherValue, anotherBody)
      }
    })

}
