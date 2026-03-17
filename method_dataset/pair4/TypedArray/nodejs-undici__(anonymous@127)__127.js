function __method_wrapper__() {
test('Should upgrade to HTTP/2 when HTTPS/1 is available for POST', async (t) => {
  t = tspl(t, { plan: 15 })

  const requestChunks = []
  const responseBody = []

  const httpsRequestChunks = []
  const httpsResponseBody = []

  const expectedBody = 'hello'
  const buf = Buffer.from(expectedBody)
  const body = new ArrayBuffer(buf.byteLength)

  buf.copy(new Uint8Array(body))

  // create the server and server stream handler
  const server = createSecureServer(
    {
      key,
      cert,
      allowHTTP1: true
    },
    (req, res) => {
      // use the stream handler for http2
      if (req.httpVersion === '2.0') {
        return
      }

      const { socket: { alpnProtocol } } = req

      req.on('data', (chunk) => {
        httpsRequestChunks.push(chunk)
      })

      req.on('end', () => {
        // handle http/1 requests
        res.writeHead(201, {
          'content-type': 'text/plain; charset=utf-8',
          'x-custom-request-header': req.headers['x-custom-request-header'] || '',
          'x-custom-alpn-protocol': alpnProtocol
        })
        res.end('hello http/1!')
      })
    }
  )

  server.on('stream', (stream, headers) => {
    t.equal(headers[':method'], 'POST')
    t.equal(headers[':path'], '/')
    t.equal(headers[':scheme'], 'https')

    const { socket: { alpnProtocol } } = stream.session

    stream.on('data', (chunk) => {
      requestChunks.push(chunk)
    })

    stream.respond({
      ':status': 201,
      'content-type': 'text/plain; charset=utf-8',
      'x-custom-request-header': headers['x-custom-request-header'] || '',
      'x-custom-alpn-protocol': alpnProtocol
    })

    stream.end('hello h2!')
  })

  // close the server on teardown
  after(() => server.close())
  await once(server.listen(0), 'listening')

  // set the port
  const port = server.address().port

  // test undici against http/2
  const client = new Client(`https://localhost:${port}`, {
    connect: {
      ca,
      servername: 'agent1'
    },
    allowH2: true
  })

  // close the client on teardown
  after(() => client.close())

  // make an undici request using where it wants http/2
  const response = await client.request({
    path: '/',
    method: 'POST',
    headers: {
      'x-custom-request-header': 'want 2.0'
    },
    body
  })

  response.body.on('data', (chunk) => {
    responseBody.push(chunk)
  })

  await once(response.body, 'end')

  t.equal(response.statusCode, 201)
  t.equal(response.headers['content-type'], 'text/plain; charset=utf-8')
  t.equal(response.headers['x-custom-request-header'], 'want 2.0')
  t.equal(response.headers['x-custom-alpn-protocol'], 'h2')
  t.equal(Buffer.concat(responseBody).toString('utf-8'), 'hello h2!')
  t.equal(Buffer.concat(requestChunks).toString('utf-8'), expectedBody)

  // make an https request for http/1 to confirm undici is using http/2
  const httpsOptions = {
    ca,
    servername: 'agent1',
    method: 'POST',
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'content-length': Buffer.byteLength(body),
      'x-custom-request-header': 'want 1.1'
    }
  }

  const httpsResponse = await new Promise((resolve, reject) => {
    const httpsRequest = https.request(`https://localhost:${port}/`, httpsOptions, (res) => {
      res.on('data', (chunk) => {
        httpsResponseBody.push(chunk)
      })

      res.on('end', () => {
        resolve(res)
      })
    }).on('error', (err) => {
      reject(err)
    })

    httpsRequest.on('error', (err) => {
      reject(err)
    })

    httpsRequest.write(Buffer.from(body))

    after(() => httpsRequest.destroy())
  })

  t.equal(httpsResponse.statusCode, 201)
  t.equal(httpsResponse.headers['content-type'], 'text/plain; charset=utf-8')
  t.equal(httpsResponse.headers['x-custom-request-header'], 'want 1.1')
  t.equal(httpsResponse.headers['x-custom-alpn-protocol'], 'false')
  t.equal(Buffer.concat(httpsResponseBody).toString('utf-8'), 'hello http/1!')
  t.equal(Buffer.concat(httpsRequestChunks).toString('utf-8'), expectedBody)

  await t.completed
})

}
