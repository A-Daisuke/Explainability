function __method_wrapper__() {
test('request post arrayBuffer', async (t) => {
  t = tspl(t, { plan: 3 })

  const server = createServer({ joinDuplicateHeaders: true }, async (req, res) => {
    let str = ''
    for await (const chunk of req) {
      str += chunk
    }
    t.strictEqual(str, 'asd')
    res.end()
  })

  after(() => server.close())

  server.listen(0)

  await once(server, 'listening')

  const client = new Client(`http://localhost:${server.address().port}`)
  after(() => client.destroy())

  const buf = Buffer.from('asd')
  const dst = new ArrayBuffer(buf.byteLength)
  buf.copy(new Uint8Array(dst))

  client.request({
    path: '/',
    method: 'GET',
    body: dst
  }, (err, data) => {
    t.ifError(err)
    data.body.resume().on('end', () => {
      t.ok(true, 'pass')
    })
  })

  await t.completed
})

}
