function __method_wrapper__() {
    await this.runTest('memory_usage retrieve operation', async () => {
      const key = `test_retrieve_${Date.now()}`;
      const value = { retrieve: true, time: Date.now() };
      
      // First store
      execSync(
        `npx claude-flow@alpha mcp call memory_usage '{"action": "store", "key": "${key}", "value": ${JSON.stringify(JSON.stringify(value))}, "namespace": "test"}'`,
        { encoding: 'utf8' }
      );
      
      // Then retrieve
      const result = execSync(
        `npx claude-flow@alpha mcp call memory_usage '{"action": "retrieve", "key": "${key}", "namespace": "test"}'`,
        { encoding: 'utf8' }
      );
      
      if (!result.includes('"found":true')) {
        throw new Error('Retrieve operation failed');
      }
    });

}
