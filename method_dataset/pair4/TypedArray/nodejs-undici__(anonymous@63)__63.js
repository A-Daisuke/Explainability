function __method_wrapper__() {
  test('.arrayBuffer()', async function (t) {
    t = tspl(t, { plan: 1 })

    function resume () {
    }
    function abort () {
    }
    const r = new Readable({ resume, abort })

    r.push(Buffer.from('hello world'))

    process.nextTick(() => {
      r.push(null)
    })

    const arrayBuffer = await r.arrayBuffer()

    const expected = new ArrayBuffer(11)
    const view = new Uint8Array(expected)
    view.set(Buffer.from('hello world'))
    t.deepStrictEqual(arrayBuffer, expected)
  })

}
