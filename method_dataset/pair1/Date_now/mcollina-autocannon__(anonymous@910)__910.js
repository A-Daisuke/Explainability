function __method_wrapper__() {
test('client calls twice using socket on secure server', (t) => {
  t.plan(4)
  const socketPath = process.platform === 'win32'
    ? path.join('\\\\?\\pipe', process.cwd(), 'autocannon-' + Date.now())
    : path.join(os.tmpdir(), 'autocannon-' + Date.now() + '.sock')

  helper.startHttpsServer({ socketPath })
  const client = new Client({
    url: 'localhost',
    protocol: 'https:',
    socketPath,
    connections: 1
  })
  let count = 0
  client.on('response', (statusCode, length) => {
    t.equal(statusCode, 200, 'status code matches')
    t.ok(length > 'hello world'.length, 'length includes the headers')
    if (count++ > 0) {
      client.destroy()
      t.end()
    }
  })
})

}
