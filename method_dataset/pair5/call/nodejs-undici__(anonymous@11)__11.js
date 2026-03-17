function __method_wrapper__() {
test('arg validation', async (t) => {
  // constructor
  t.assert.throws(() => {
    // eslint-disable-next-line
    new Response(null, 0)
  }, TypeError)
  t.assert.throws(() => {
    // eslint-disable-next-line
    new Response(null, {
      status: 99
    })
  }, RangeError)
  t.assert.throws(() => {
    // eslint-disable-next-line
    new Response(null, {
      status: 600
    })
  }, RangeError)
  t.assert.throws(() => {
    // eslint-disable-next-line
    new Response(null, {
      status: '600'
    })
  }, RangeError)
  t.assert.throws(() => {
    // eslint-disable-next-line
    new Response(null, {
      statusText: '\u0000'
    })
  }, TypeError)

  for (const nullStatus of [204, 205, 304]) {
    t.assert.throws(() => {
      // eslint-disable-next-line
      new Response(new ArrayBuffer(16), {
        status: nullStatus
      })
    }, TypeError)
  }

  t.assert.doesNotThrow(() => {
    Response.prototype[Symbol.toStringTag].charAt(0)
  }, TypeError)

  t.assert.throws(() => {
    Response.prototype.type.toString()
  }, TypeError)

  t.assert.throws(() => {
    Response.prototype.url.toString()
  }, TypeError)

  t.assert.throws(() => {
    Response.prototype.redirected.toString()
  }, TypeError)

  t.assert.throws(() => {
    Response.prototype.status.toString()
  }, TypeError)

  t.assert.throws(() => {
    Response.prototype.ok.toString()
  }, TypeError)

  t.assert.throws(() => {
    Response.prototype.statusText.toString()
  }, TypeError)

  t.assert.throws(() => {
    Response.prototype.headers.toString()
  }, TypeError)

  t.assert.throws(() => {
    // eslint-disable-next-line no-unused-expressions
    Response.prototype.body
  }, TypeError)

  t.assert.throws(() => {
    // eslint-disable-next-line no-unused-expressions
    Response.prototype.bodyUsed
  }, TypeError)

  t.assert.throws(() => {
    Response.prototype.clone.call(null)
  }, TypeError)

  await t.assert.rejects(
    new Response('http://localhost').text.call({
      blob () {
        return {
          text () {
            return Promise.resolve('emulating response.blob()')
          }
        }
      }
    }), TypeError)
})

}
