function __method_wrapper__() {
test('MockAgent - getCallHistory with fetch should return the call history instance with history log', async (t) => {
  t = tspl(t, { plan: 9 })

  const mockAgent = new MockAgent({ enableCallHistory: true })
  setGlobalDispatcher(mockAgent)
  after(() => mockAgent.close())

  const baseUrl = 'http://localhost:9999'
  const mockClient = mockAgent.get(baseUrl)
  mockClient.intercept({
    path: /^\/foo/,
    method: 'POST'
  }).reply(200, 'foo')

  t.ok(mockAgent.getCallHistory()?.calls().length === 0)

  const path = '/foo'
  const url = new URL(path, baseUrl)
  const method = 'POST'
  const body = { data: 'value' }
  const query = { a: 1 }
  url.search = new URLSearchParams(query)
  const headers = { authorization: 'token', 'content-type': 'application/json' }

  await fetch(url, { method, query, body: JSON.stringify(body), headers })

  t.ok(mockAgent.getCallHistory()?.calls().length === 1)
  t.strictEqual(mockAgent.getCallHistory()?.lastCall()?.body, JSON.stringify(body))
  t.deepStrictEqual(mockAgent.getCallHistory()?.lastCall()?.headers, {
    ...headers,
    'accept-encoding': 'gzip, deflate',
    'content-length': '16',
    'content-type': 'application/json',
    'accept-language': '*',
    'sec-fetch-mode': 'cors',
    'user-agent': 'undici',
    accept: '*/*'
  })
  t.strictEqual(mockAgent.getCallHistory()?.lastCall()?.method, method)
  t.strictEqual(mockAgent.getCallHistory()?.lastCall()?.origin, baseUrl)
  t.strictEqual(mockAgent.getCallHistory()?.lastCall()?.path, url.pathname)
  t.strictEqual(mockAgent.getCallHistory()?.lastCall()?.fullUrl, url.toString())
  t.deepStrictEqual(mockAgent.getCallHistory()?.lastCall()?.searchParams, { a: '1' })

  await t.completed
})

}
