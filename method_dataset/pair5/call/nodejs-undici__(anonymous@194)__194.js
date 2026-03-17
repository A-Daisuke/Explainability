function __method_wrapper__() {
test('factory option with basic get request', async (t) => {
  const p = tspl(t, { plan: 12 })

  let factoryCalled = 0
  const opts = {
    factory: (origin, opts) => {
      factoryCalled++
      return new Pool(origin, opts)
    }
  }

  const client = new BalancedPool([], opts)

  let serverCalled = 0
  const server = createServer({ joinDuplicateHeaders: true }, (req, res) => {
    serverCalled++
    p.strictEqual('/', req.url)
    p.strictEqual('GET', req.method)
    res.setHeader('content-type', 'text/plain')
    res.end('hello')
  })
  t.after(server.close.bind(server))

  await promisify(server.listen).call(server, 0)

  client.addUpstream(`http://localhost:${server.address().port}`)

  p.deepStrictEqual(client.upstreams, [`http://localhost:${server.address().port}`])

  t.after(client.destroy.bind(client))

  {
    const { statusCode, headers, body } = await client.request({ path: '/', method: 'GET' })
    p.strictEqual(statusCode, 200)
    p.strictEqual(headers['content-type'], 'text/plain')
    p.strictEqual('hello', await body.text())
  }

  p.strictEqual(serverCalled, 1)
  p.strictEqual(factoryCalled, 1)

  p.strictEqual(client.destroyed, false)
  p.strictEqual(client.closed, false)
  await client.close()
  p.strictEqual(client.destroyed, true)
  p.strictEqual(client.closed, true)
})

}
