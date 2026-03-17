function __method_wrapper__() {
    await this.runTest('memory_usage store operation', async () => {
      const key = `test_${Date.now()}`;
      const value = { test: true, timestamp: new Date().toISOString() };
      
      const result = execSync(
        `npx claude-flow@alpha mcp call memory_usage '{"action": "store", "key": "${key}", "value": ${JSON.stringify(JSON.stringify(value))}, "namespace": "test"}'`,
        { encoding: 'utf8' }
      );
      
      if (!result.includes('"success":true') && !result.includes('"stored":true')) {
        throw new Error('Store operation failed');
      }

      // Verify in database
      const rows = await this.queryDatabase(
        `SELECT * FROM memory_entries WHERE key = '${key}' AND namespace = 'test'`
      );
      
      if (rows.length === 0) {
        throw new Error('Data not found in database');
      }
    });

}
