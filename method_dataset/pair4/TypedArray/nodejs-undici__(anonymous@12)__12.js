function __method_wrapper__() {
describe('prioritize socket errors over timeouts', { skip }, async () => {
  const t = tspl({ ...assert, after: () => {} }, { plan: 2 })
  const client = new Pool('http://foorbar.invalid:1234', { connectTimeout: 1 })

  client.request({ method: 'GET', path: '/foobar' })
    .then(() => t.fail())
    .catch((err) => {
      t.strictEqual(err.code, 'ENOTFOUND')
      t.strictEqual(err.code !== 'UND_ERR_CONNECT_TIMEOUT', true)
    })

  // block for 1s which is enough for the dns lookup to complete and the
  // Timeout to fire
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, Number(1000))

  await t.completed
})

}
