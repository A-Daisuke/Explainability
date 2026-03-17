function __method_wrapper__() {
    await this.runTest('Concurrent writes succeed', async () => {
      const promises = [];
      
      // Spawn 5 concurrent write operations
      for (let i = 0; i < 5; i++) {
        const key = `concurrent_${Date.now()}_${i}`;
        promises.push(
          new Promise((resolve, reject) => {
            try {
              const result = execSync(
                `npx claude-flow@alpha mcp call memory_usage '{"action": "store", "key": "${key}", "value": "test${i}", "namespace": "concurrent"}'`,
                { encoding: 'utf8' }
              );
              resolve(result);
            } catch (error) {
              reject(error);
            }
          })
        );
      }
      
      const results = await Promise.all(promises);
      
      // Verify all succeeded
      for (const result of results) {
        if (!result.includes('"success":true')) {
          throw new Error('Concurrent write failed');
        }
      }
      
      // Verify all entries in database
      const rows = await this.queryDatabase(
        `SELECT COUNT(*) as count FROM memory_entries WHERE namespace = 'concurrent'`
      );
      
      if (rows[0].count < 5) {
        throw new Error(`Expected at least 5 concurrent entries, found ${rows[0].count}`);
      }
    });

}
