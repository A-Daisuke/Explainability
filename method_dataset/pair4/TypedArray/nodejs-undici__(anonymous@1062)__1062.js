function __method_wrapper__() {
  it('should allow POST request with ArrayBufferView (BigUint64Array) body', () => {
    const encoder = new TextEncoder()
    const url = `${base}inspect`
    const options = {
      method: 'POST',
      body: new BigUint64Array(encoder.encode('0123456789abcdef').buffer)
    }
    return fetch(url, options).then(res => res.json()).then(res => {
      assert.strictEqual(res.method, 'POST')
      assert.strictEqual(res.body, '0123456789abcdef')
      assert.strictEqual(res.headers['transfer-encoding'], undefined)
      assert.strictEqual(res.headers['content-type'], undefined)
      assert.strictEqual(res.headers['content-length'], '16')
    })
  })

}
