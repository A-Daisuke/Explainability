function __method_wrapper__() {
    test('vary directives used to decide which response to use', options, async () => {
      /**
       * @type {import('../../types/cache-interceptor.d.ts').default.CacheKey}
       */
      const key = {
        origin: 'localhost',
        path: '/',
        method: 'GET',
        headers: {
          'some-header': 'hello world'
        }
      }

      /**
       * @type {import('../../types/cache-interceptor.d.ts').default.CacheValue}
       */
      const value = {
        statusCode: 200,
        statusMessage: '',
        headers: { foo: 'bar' },
        vary: {
          'some-header': 'hello world'
        },
        cacheControlDirectives: {},
        cachedAt: Date.now(),
        staleAt: Date.now() + 1000,
        deleteAt: Date.now() + 1000
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

      {
        const result = await store.get(structuredClone(key))
        notEqual(result, undefined)
        await compareGetResults(result, value, body)
      }

      /**
       * Let's make another key to the same resource but with a different vary
       *  header
       * @type {import('../../types/cache-interceptor.d.ts').default.CacheKey}
       */
      const anotherKey = {
        origin: 'localhost',
        path: '/',
        method: 'GET',
        headers: {
          'some-header': 'hello world2'
        }
      }

      /**
       * @type {import('../../types/cache-interceptor.d.ts').default.CacheValue}
       */
      const anotherValue = {
        statusCode: 200,
        statusMessage: '',
        headers: { foo: 'bar' },
        vary: {
          'some-header': 'hello world2'
        },
        cacheControlDirectives: {},
        cachedAt: Date.now(),
        staleAt: Date.now() + 1000,
        deleteAt: Date.now() + 1000
      }

      const anotherBody = [Buffer.from('asd'), Buffer.from('123')]

      equal(await store.get(anotherKey), undefined)

      {
        const writable = store.createWriteStream(anotherKey, anotherValue)
        notEqual(writable, undefined)
        writeBody(writable, anotherBody)
      }

      {
        const result = await store.get(structuredClone(key))
        notEqual(result, undefined)
        await compareGetResults(result, value, body)
      }

      {
        const result = await store.get(structuredClone(anotherKey))
        notEqual(result, undefined)
        await compareGetResults(result, anotherValue, anotherBody)
      }
    })

}
