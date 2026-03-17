function __method_wrapper__() {
  async (t) => {
    const server = createSecureServer(await pem.generate({ opts: { keySize: 2048 } }))
    const expectedBody = 'hello'
    const requestChunks = []
    const expectedResponseBody = { hello: 'h2' }
    const buf = Buffer.from(expectedBody)
    const body = new ArrayBuffer(buf.byteLength)

    buf.copy(new Uint8Array(body))

    t.plan(8)

    server.on('stream', async (stream, headers) => {
      t.assert.strictEqual(headers[':method'], 'PUT')
      t.assert.strictEqual(headers[':path'], '/')
      t.assert.strictEqual(headers[':scheme'], 'https')

      stream.on('data', chunk => requestChunks.push(chunk))

      stream.respond({
        'content-type': 'application/json',
        'x-custom-h2': headers['x-my-header'],
        ':status': 200
      })

      stream.end(JSON.stringify(expectedResponseBody))
    })

    server.listen(0)
    await once(server, 'listening')

    const client = new Client(`https://localhost:${server.address().port}`, {
      connect: {
        rejectUnauthorized: false
      },
      allowH2: true
    })

    t.after(closeClientAndServerAsPromise(client, server))

    const response = await fetch(
      `https://localhost:${server.address().port}/`,
      // Needs to be passed to disable the reject unauthorized
      {
        body,
        method: 'PUT',
        dispatcher: client,
        headers: {
          'x-my-header': 'foo',
          'content-type': 'text-plain'
        }
      }
    )

    const responseBody = await response.json()

    t.assert.strictEqual(response.status, 200)
    t.assert.strictEqual(response.headers.get('content-type'), 'application/json')
    t.assert.strictEqual(response.headers.get('x-custom-h2'), 'foo')
    t.assert.deepStrictEqual(responseBody, expectedResponseBody)
    t.assert.strictEqual(Buffer.concat(requestChunks).toString('utf-8'), expectedBody)
  }

}
