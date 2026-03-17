function __method_wrapper__() {
test('request post body Float64Array', async (t) => {
  t = tspl(t, { plan: 2 })
  const fullBuffer = new TextEncoder().encode('abcdefghijklmnopqrstuvwxyz')
  const requestBody = new Float64Array(fullBuffer.buffer, 8, 2)

  const server = createServer({ joinDuplicateHeaders: true }, async (req, res) => {
    let ret = ''
    for await (const chunk of req) {
      ret += chunk
    }
    t.strictEqual(ret, 'ijklmnopqrstuvwx')
    res.end()
  })
  after(() => server.close())

  server.listen(0, async () => {
    const client = new Client(`http://localhost:${server.address().port}`)
    after(() => client.destroy())

    const { body } = await client.request({
      path: '/',
      method: 'POST',
      body: requestBody
    })
    await body.text()
    t.ok(true, 'pass')
  })

  await t.completed
})

}
