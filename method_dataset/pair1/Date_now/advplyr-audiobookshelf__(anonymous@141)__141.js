function __method_wrapper__() {
    return this.runCommand('up', async ({ context }) => {
      const toBeApplied = await eligibleMigrations(context)
      for (const m of toBeApplied) {
        const start = Date.now()
        const params = { name: m.name, path: m.path, context }
        this.logging({ event: 'migrating', name: m.name })
        try {
          await m.up(params)
        } catch (e) {
          throw new MigrationError({ direction: 'up', ...params }, e)
        }
        await this.storage.logMigration(params)
        const duration = (Date.now() - start) / 1000
        this.logging({ event: 'migrated', name: m.name, durationSeconds: duration })
      }
      return toBeApplied.map((m) => ({ name: m.name, path: m.path }))
    })

}
