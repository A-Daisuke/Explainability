function __method_wrapper__() {
    server.listen(0, async () => {
      const port = server.address().port

      const start = Date.now()
      const eventSourceInstance = new EventSource(`http://localhost:${port}`)

      let connectionCount = 0
      eventSourceInstance.onopen = () => {
        if (++connectionCount === 2) {
          t.assert.ok(Date.now() - start >= 100)
          t.assert.ok(Date.now() - start < 1000)
          eventSourceInstance.close()
          t.assert.ok(true)

          done()
        }
      }

      await once(eventSourceInstance, 'open')

      clock.tick(10)
      await once(eventSourceInstance, 'error')

      clock.tick(100)
    })

}
