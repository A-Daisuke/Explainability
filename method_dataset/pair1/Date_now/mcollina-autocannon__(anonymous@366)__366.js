function __method_wrapper__() {
test('run should accept a unix socket/windows pipe', (t) => {
  t.plan(11)

  const socketPath = process.platform === 'win32'
    ? path.join('\\\\?\\pipe', process.cwd(), 'autocannon-' + Date.now())
    : path.join(os.tmpdir(), 'autocannon-' + Date.now() + '.sock')

  helper.startServer({ socketPath })

  initJob({
    url: 'localhost',
    socketPath,
    connections: 2,
    duration: 2
  }, (err, result) => {
    t.error(err)
    t.ok(result, 'results should exist')
    t.equal(result.socketPath, socketPath, 'socketPath should be included in result')
    t.ok(result.requests.total > 0, 'should make at least one request')

    if (process.platform === 'win32') {
      // On Windows a few errors are expected. We'll accept a 1% error rate on
      // the pipe.
      t.ok(result.errors / result.requests.total < 0.01, `should have less than 1% errors on Windows (had ${result.errors} errors)`)
    } else {
      t.equal(result.errors, 0, 'no errors')
    }

    t.equal(result['1xx'], 0, '1xx codes')
    t.equal(result['2xx'], result.requests.total, '2xx codes')
    t.equal(result['3xx'], 0, '3xx codes')
    t.equal(result['4xx'], 0, '4xx codes')
    t.equal(result['5xx'], 0, '5xx codes')
    t.equal(result.non2xx, 0, 'non 2xx codes')
    t.end()
  })
})

}
