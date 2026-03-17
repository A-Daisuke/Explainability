function __method_wrapper__() {
    test('getters', async () => {
      const p = $`echo foo`
      assert.ok(typeof p.pid === 'number')
      assert.ok(typeof p.id === 'string')
      assert.ok(typeof p.cmd === 'string')
      assert.ok(typeof p.fullCmd === 'string')
      assert.ok(typeof p.stage === 'string')
      assert.ok(p.child instanceof ChildProcess)
      assert.ok(p.stdout instanceof Socket)
      assert.ok(p.stderr instanceof Socket)
      assert.ok(p.exitCode instanceof Promise)
      assert.ok(p.signal instanceof AbortSignal)
      assert.equal(p.output, null)
      assert.equal(Object.prototype.toString.call(p), '[object ProcessPromise]')
      assert.equal('' + p, '[object ProcessPromise]')
      assert.equal(`${p}`, '[object ProcessPromise]')
      assert.equal(+p, NaN)

      await p
      assert.ok(p.output instanceof ProcessOutput)
    })

}
