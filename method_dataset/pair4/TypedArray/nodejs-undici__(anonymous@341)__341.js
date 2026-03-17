function __method_wrapper__() {
  async t => {
    t = tspl(t, { plan: 8 })

    const server = createSecureServer(await pem.generate({ opts: { keySize: 2048 } }))
    const expectedBody = 'hello'
    const requestChunks = []
    const responseBody = []
    const buf = Buffer.from(expectedBody)
    const body = new ArrayBuffer(buf.byteLength)

    buf.copy(new Uint8Array(body))

    server.on('stream', (stream, headers) => {
      t.strictEqual(headers[':method'], 'POST')
      t.strictEqual(headers[':path'], '/')
      t.strictEqual(headers[':scheme'], 'https')

      stream.on('data', chunk => requestChunks.push(chunk))

      stream.respond({
        'content-type': 'text/plain; charset=utf-8',
        'x-custom-h2': headers['x-my-header'],
        ':status': 200
      })

      stream.end('hello h2!')
    })

    after(() => server.close())
    await once(server.listen(0), 'listening')

    const client = new Client(`https://localhost:${server.address().port}`, {
      connect: {
        rejectUnauthorized: false
      },
      allowH2: true
    })
    after(() => client.close())

    const response = await client.request({
      path: '/',
      method: 'POST',
      headers: {
        'x-my-header': 'foo'
      },
      body
    })

    response.body.on('data', chunk => {
      responseBody.push(chunk)
    })

    await once(response.body, 'end')

    t.strictEqual(response.statusCode, 200)
    t.strictEqual(response.headers['content-type'], 'text/plain; charset=utf-8')
    t.strictEqual(response.headers['x-custom-h2'], 'foo')
    t.strictEqual(Buffer.concat(responseBody).toString('utf-8'), 'hello h2!')
    t.strictEqual(Buffer.concat(requestChunks).toString('utf-8'), expectedBody)

    await t.completed
  }

}
