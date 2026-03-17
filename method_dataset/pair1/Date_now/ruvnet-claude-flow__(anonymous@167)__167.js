function __method_wrapper__() {
    it('should process 100 files faster than 10 seconds', async () => {
      // Create 100 small files
      for (let i = 0; i < 100; i++) {
        await fs.writeFile(
          path.join(TEST_DIR, `file${i}.js`),
          `function test${i}() {}\n`
        );
      }

      const startTime = Date.now();
      await execAsync(
        `npx claude-flow agent booster batch "${TEST_DIR}/*.js" "Add comment"`
      );
      const duration = Date.now() - startTime;

      // Should be much faster than LLM API (35.2 seconds for 100 files)
      expect(duration).toBeLessThan(10000); // 10 seconds
    }, 120000);

}
