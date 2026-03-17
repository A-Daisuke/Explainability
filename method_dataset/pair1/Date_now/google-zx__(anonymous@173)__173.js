function __method_wrapper__() {
    test('integration', async () => {
      const now = Date.now()
      const p = await zx(`
    try {
      await retry(5, '50ms', () => $\`exit 123\`)
    } catch (e) {
      echo('exitCode:', e.exitCode)
    }
    await retry(5, () => $\`exit 0\`)
    echo('success')
`)
      assert.ok(p.toString().includes('exitCode: 123'))
      assert.ok(p.toString().includes('success'))
      assert.ok(Date.now() >= now + 50 * (5 - 1))
    })

}
