function __method_wrapper__() {
  server.on('request', (req, res) => {
    switch (counter) {
      case 0:
        checkpoint = Date.now()
        res.writeHead(429, {
          'retry-after': new Date(
            checkpoint + 2000
          ).toUTCString()
        })
        res.end('rate limit')
        counter++
        return
      case 1:
        res.writeHead(200)
        res.end('hello world!')
        t.ok(Date.now() - checkpoint >= 1000)
        counter++
        return
      default:
        t.fail('unexpected request')
    }
  })

}
