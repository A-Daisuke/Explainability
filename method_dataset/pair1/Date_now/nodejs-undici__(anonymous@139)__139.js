function __method_wrapper__() {
test('emits maxSizeExceeded event when limits exceeded', async () => {
  const maxSize = 10
  const store = new MemoryCacheStore({ maxSize })

  let eventFired = false
  let eventPayload = null

  store.on('maxSizeExceeded', (payload) => {
    eventFired = true
    eventPayload = payload
  })

  const testData = 'x'.repeat(maxSize + 1) // Exceed maxSize

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

  equal(eventFired, true, 'maxSizeExceeded event should fire')
  equal(typeof eventPayload, 'object', 'Event should have payload')
  equal(typeof eventPayload.size, 'number', 'Payload should have size')
  equal(typeof eventPayload.maxSize, 'number', 'Payload should have maxSize')
  equal(typeof eventPayload.count, 'number', 'Payload should have count')
  equal(typeof eventPayload.maxCount, 'number', 'Payload should have maxCount')
})

}
