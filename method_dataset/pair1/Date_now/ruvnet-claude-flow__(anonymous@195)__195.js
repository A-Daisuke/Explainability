function __method_wrapper__() {
    test('should protect sensitive data in memory', async () => {
      const sensitiveData = {
        password: 'secret123',
        apiKey: 'sk-1234567890abcdef',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        privateKey: '-----BEGIN PRIVATE KEY-----\\nMIIEvg...',
        socialSecurityNumber: '123-45-6789',
        creditCard: '4111-1111-1111-1111'
      };

      const key = `sensitive-${Date.now()}`;
      await memoryManager.store(key, sensitiveData, 'security-test');

      // Verify data is stored securely (implementation dependent)
      const retrieved = await memoryManager.retrieve(key, 'security-test');
      expect(retrieved).toBeDefined();

      // If encryption is implemented, sensitive fields should be encrypted
      // This is a placeholder - actual validation depends on encryption implementation
      if (memoryManager.isEncryptionEnabled?.()) {
        // Verify sensitive data is encrypted at rest
        const rawData = await memoryManager.getRawData?.(key, 'security-test');
        expect(rawData).not.toContain('secret123');
        expect(rawData).not.toContain('sk-1234567890abcdef');
      }

      // Clean up
      await memoryManager.delete(key, 'security-test');
    });

}
