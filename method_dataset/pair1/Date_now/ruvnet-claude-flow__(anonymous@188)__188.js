function __method_wrapper__() {
    await this.runTest('Hooks persist to SQLite', async () => {
      const message = `Test hook ${Date.now()}`;
      
      const result = execSync(
        `npx claude-flow@alpha hooks notify --message "${message}" --level "test"`,
        { encoding: 'utf8' }
      );
      
      if (!result.includes('saved to .swarm/memory.db')) {
        throw new Error('Hook notification not saved');
      }

      // Verify in database
      const rows = await this.queryDatabase(
        `SELECT * FROM messages WHERE key LIKE '%notify%' ORDER BY timestamp DESC LIMIT 1`
      );
      
      if (rows.length === 0) {
        throw new Error('Hook message not found in database');
      }
    });

}
