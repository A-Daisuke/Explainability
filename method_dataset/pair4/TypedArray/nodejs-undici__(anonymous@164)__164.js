function __method_wrapper__() {
  test('Send with ArrayBuffer', (t) => {
    const message = new TextEncoder().encode('message')
    const ab = new ArrayBuffer(7)
    new Uint8Array(ab).set(message)

    const server = new WebSocketServer({ port: 0 })

    const ws = new WebSocket(`ws://localhost:${server.address().port}`)

    ws.addEventListener('open', () => {
      ws.send(ab)
    })

    return new Promise((resolve) => {
      server.on('connection', (ws) => {
        ws.on('message', (data, isBinary) => {
          t.assert.ok(isBinary)
          t.assert.deepStrictEqual(new Uint8Array(data), message)
          ws.close(1000)
          server.close()
          resolve()
        })
      })
    })
  })

}
