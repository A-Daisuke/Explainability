function __method_wrapper__() {
    return this.runCommand('down', async ({ context }) => {
      var _b
      const toBeReverted = await eligibleMigrations(context)
      for (const m of toBeReverted) {
        const start = Date.now()
        const params = { name: m.name, path: m.path, context }
        this.logging({ event: 'reverting', name: m.name })
        try {
          await ((_b = m.down) === null || _b === void 0 ? void 0 : _b.call(m, params))
        } catch (e) {
          throw new MigrationError({ direction: 'down', ...params }, e)
        }
        await this.storage.unlogMigration(params)
        const duration = Number.parseFloat(((Date.now() - start) / 1000).toFixed(3))
        this.logging({ event: 'reverted', name: m.name, durationSeconds: duration })
      }
      return toBeReverted.map((m) => ({ name: m.name, path: m.path }))
    })

}
