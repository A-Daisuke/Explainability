function __method_wrapper__() {
test('basic get', async (t) => {
  const p = tspl(t, { plan: 16 })

  let server1Called = 0
  const server1 = createServer({ joinDuplicateHeaders: true }, (req, res) => {
    server1Called++
    p.strictEqual('/', req.url)
    p.strictEqual('GET', req.method)
    res.setHeader('content-type', 'text/plain')
    res.end('hello')
  })
  t.after(server1.close.bind(server1))

  await promisify(server1.listen).call(server1, 0)

  let server2Called = 0
  const server2 = createServer({ joinDuplicateHeaders: true }, (req, res) => {
    server2Called++
    p.strictEqual('/', req.url)
    p.strictEqual('GET', req.method)
    res.setHeader('content-type', 'text/plain')
    res.end('hello')
  })
  t.after(server2.close.bind(server2))

  await promisify(server2.listen).call(server2, 0)

  const client = new BalancedPool()
  client.addUpstream(`http://localhost:${server1.address().port}`)
  client.addUpstream(`http://localhost:${server2.address().port}`)
  t.after(client.destroy.bind(client))

  {
    const { statusCode, headers, body } = await client.request({ path: '/', method: 'GET' })
    p.strictEqual(statusCode, 200)
    p.strictEqual(headers['content-type'], 'text/plain')
    p.strictEqual('hello', await body.text())
  }

  {
    const { statusCode, headers, body } = await client.request({ path: '/', method: 'GET' })
    p.strictEqual(statusCode, 200)
    p.strictEqual(headers['content-type'], 'text/plain')
    p.strictEqual('hello', await body.text())
  }

  p.strictEqual(server1Called, 1)
  p.strictEqual(server2Called, 1)

  p.strictEqual(client.destroyed, false)
  p.strictEqual(client.closed, false)
  await client.close()
  p.strictEqual(client.destroyed, true)
  p.strictEqual(client.closed, true)
})

}
