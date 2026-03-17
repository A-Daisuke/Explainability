function __method_wrapper__() {
  server.listen(0, () => {
    const client = new Client(`http://localhost:${server.address().port}`)
    t.after(() => { return client.close() })

    client.request({
      path: '/',
      method: 'POST',
      body: /asdasd/
    }, (err, data) => {
      p.ok(err instanceof errors.InvalidArgumentError)
    })

    client.request({
      path: '/',
      method: 'POST',
      body: 0
    }, (err, data) => {
      p.ok(err instanceof errors.InvalidArgumentError)
    })

    client.request({
      path: '/',
      method: 'POST',
      body: false
    }, (err, data) => {
      p.ok(err instanceof errors.InvalidArgumentError)
    })

    client.request({
      path: '/',
      method: 'POST',
      body: ''
    }, (err, data) => {
      p.ifError(err)
      data.body.resume()
    })

    client.request({
      path: '/',
      method: 'POST',
      body: new Uint8Array()
    }, (err, data) => {
      p.ifError(err)
      data.body.resume()
    })

    client.request({
      path: '/',
      method: 'POST',
      body: Buffer.alloc(10)
    }, (err, data) => {
      p.ifError(err)
      data.body.resume()
    })
  })

}
