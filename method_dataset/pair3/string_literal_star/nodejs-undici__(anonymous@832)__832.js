function __method_wrapper__() {
test('ProxyAgent correctly sends headers when using fetch - #1355, #1623 (with proxy tunneling enabled)', async (t) => {
  t = tspl(t, { plan: 2 })
  const defaultDispatcher = getGlobalDispatcher()

  const server = await buildServer()
  const proxy = await buildProxy()

  const serverUrl = `http://localhost:${server.address().port}`
  const proxyUrl = `http://localhost:${proxy.address().port}`

  const proxyAgent = new ProxyAgent({ uri: proxyUrl, proxyTunnel: true })
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

  const expectedProxyHeaders = {
    'proxy-connection': 'keep-alive',
    host: `localhost:${server.address().port}`,
    connection: 'close'
  }

  proxy.on('connect', (req, res) => {
    t.deepStrictEqual(req.headers, expectedProxyHeaders)
  })

  server.on('request', (req, res) => {
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
