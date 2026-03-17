function __method_wrapper__() {
test('MockAgent - getCallHistory with fetch with a minimal configuration should register call history log', async (t) => {
  t = tspl(t, { plan: 11 })

  const mockAgent = new MockAgent({ enableCallHistory: true })
  setGlobalDispatcher(mockAgent)
  after(() => mockAgent.close())

  const baseUrl = 'http://localhost:9999'
  const mockClient = mockAgent.get(baseUrl)
  mockClient.intercept({
    path: '/'
  }).reply(200, 'foo')

  const path = '/'
  const url = new URL(path, baseUrl)

  await fetch(url)

  t.ok(mockAgent.getCallHistory()?.calls().length === 1)
  t.strictEqual(mockAgent.getCallHistory()?.lastCall()?.body, null)
  t.deepStrictEqual(mockAgent.getCallHistory()?.lastCall()?.headers, {
    'accept-encoding': 'gzip, deflate',
    'accept-language': '*',
    'sec-fetch-mode': 'cors',
    'user-agent': 'undici',
    accept: '*/*'
  })
  t.strictEqual(mockAgent.getCallHistory()?.lastCall()?.method, 'GET')
  t.strictEqual(mockAgent.getCallHistory()?.lastCall()?.origin, baseUrl)
  t.strictEqual(mockAgent.getCallHistory()?.lastCall()?.path, path)
  t.strictEqual(mockAgent.getCallHistory()?.lastCall()?.fullUrl, baseUrl + path)
  t.deepStrictEqual(mockAgent.getCallHistory()?.lastCall()?.searchParams, {})
  t.strictEqual(mockAgent.getCallHistory()?.lastCall()?.host, 'localhost:9999')
  t.strictEqual(mockAgent.getCallHistory()?.lastCall()?.port, '9999')
  t.strictEqual(mockAgent.getCallHistory()?.lastCall()?.protocol, 'http:')

  await t.completed
})

}
