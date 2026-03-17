function __method_wrapper__() {
  test('should try to connect again if server is unreachable, configure reconnectionTime', async (t) => {
    const reconnectionTime = 1000
    const clock = FakeTimers.install()
    after(() => clock.uninstall())

    const domain = 'bad.n' + randomInt(1e10).toString(36) + '.proxy'

    const eventSourceInstance = new EventSource(`http://${domain}`, {
      node: {
        reconnectionTime
      }
    })

    const onerrorCalls = []
    eventSourceInstance.onerror = (error) => {
      onerrorCalls.push(error)
    }

    await once(eventSourceInstance, 'error')

    const start = Date.now()
    clock.tick(reconnectionTime)
    await once(eventSourceInstance, 'error')
    clock.tick(reconnectionTime)
    await once(eventSourceInstance, 'error')
    clock.tick(reconnectionTime)
    await once(eventSourceInstance, 'error')
    const end = Date.now()

    eventSourceInstance.close()

    t.assert.strictEqual(onerrorCalls.length, 4, 'Expected 4 error events')
    t.assert.strictEqual(end - start, 3 * reconnectionTime, `Expected reconnection to happen after ${3 * reconnectionTime}ms, but took ${end - start}ms`)
  })

}
