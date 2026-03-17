function __method_wrapper__() {
    test('getters', async () => {
      const o = new ProcessOutput(-1, 'SIGTERM', '', '', 'foo\n', 'msg', 20)

      assert.equal(o.stdout, '')
      assert.equal(o.stderr, '')
      assert.equal(o.stdall, 'foo\n')
      assert.equal(o.signal, 'SIGTERM')
      assert.equal(o.exitCode, -1)
      assert.equal(o.duration, 20)
      assert.equal(o.ok, false)
      assert.equal(
        o.message,
        'msg\n    errno: undefined (Unknown error)\n    code: undefined\n    at '
      )
      assert.equal(Object.prototype.toString.call(o), '[object ProcessOutput]')

      const o1 = new ProcessOutput({
        code: -1,
        from: 'file.js(12:34)',
        store: {
          stdall: ['error in stdout'],
          stdout: [],
          stderr: [],
        },
      })
      assert.equal(
        o1.message,
        '\n    at file.js(12:34)\n    exit code: -1\n    details: \nerror in stdout'
      )
    })

}
