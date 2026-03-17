function __method_wrapper__() {
test('ProxyAgent correctly sends headers when using fetch - #1355, #1623', async (t) => {
  t = tspl(t, { plan: 1 })
  const defaultDispatcher = getGlobalDispatcher()

  const server = await buildServer()
  const proxy = await buildProxy()

  const serverUrl = `http://localhost:${server.address().port}`
  const proxyUrl = `http://localhost:${proxy.address().port}`

  const proxyAgent = new ProxyAgent({ uri: proxyUrl, proxyTunnel: false })
  setGlobalDispatcher(proxyAgent)

  after(() => setGlobalDispatcher(defaultDispatcher))

  const expectedHeaders = {
    host: `localhost:${server.address().port}`,
    connection: 'keep-alive',
    'test-header': 'value',
    accept: '*/*',
    'accept-language': '*',
    'sec-fetch-mode': 'cors',
    'user-agent': 'undici',
    'accept-encoding': 'gzip, deflate'
  }

  proxy.on('connect', (req, res) => {
    // proxyTunnel must be set to true in order to tunnel into the endpoint for HTTP->HTTP proxy connections
    t.fail(true, 'connect to proxy should unreachable by default for HTTP->HTTP proxy connections')
  })

  server.on('request', (req, res) => {
    // The `proxy` package will add a "via" and "x-forwarded-for" header for non-tunneled Proxy requests
    for (const header of ['via', 'x-forwarded-for']) {
      delete req.headers[header]
    }
    t.deepStrictEqual(req.headers, expectedHeaders)
    res.end('goodbye')
  })

  await fetch(serverUrl, {
    headers: { 'Test-header': 'value' }
  })

  server.close()
  proxy.close()
  proxyAgent.close()
  t.end()
})

}
