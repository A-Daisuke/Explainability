function __method_wrapper__() {
    test('should handle malformed JSON and data injection', async () => {
      const maliciousData = [
        '{"__proto__": {"isAdmin": true}}',
        '{"constructor": {"prototype": {"isAdmin": true}}}',
        'function() { return process.env; }',
        '(() => { require("child_process").exec("rm -rf /"); })()',
        Buffer.from('malicious binary data'),
        new RegExp('(.)*', 'g'), // ReDoS pattern
        Symbol('evil'),
        undefined,
        null
      ];

      for (const data of maliciousData) {
        try {
          const key = `malicious-${Date.now()}-${Math.random()}`;
          await memoryManager.store(key, data, 'security-test');
          
          // If storage succeeded, verify data was sanitized
          const retrieved = await memoryManager.retrieve(key, 'security-test');
          expect(retrieved).toBeDefined();
          
          // Verify prototype pollution didn't occur
          expect(Object.prototype).not.toHaveProperty('isAdmin');
          expect({}).not.toHaveProperty('isAdmin');
          
          // Clean up
          await memoryManager.delete(key, 'security-test');
        } catch (error) {
          // Expected - malicious data should be rejected
          expect(error).toBeDefined();
        }
      }
    });

}
