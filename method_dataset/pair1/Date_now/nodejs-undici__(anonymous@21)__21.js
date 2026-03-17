function __method_wrapper__() {
    server.listen(0, () => {
      const port = server.address().port

      const start = Date.now()
      let connectionCount = 0
      const eventSourceInstance = new EventSource(`http://localhost:${port}`)
      eventSourceInstance.onopen = () => {
        if (++connectionCount === 2) {
          t.assert.ok(Date.now() - start >= 100)
          t.assert.ok(Date.now() - start < 1000)
          eventSourceInstance.close()
          done()
        }
      }
      eventSourceInstance.onmessage = () => {
        t.assert.fail('Should not have received a message')
        eventSourceInstance.close()
      }
    })

}
