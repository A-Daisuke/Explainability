function __method_wrapper__() {
    it('should authenticate with basic auth', async () => {
      const authConfig = {
        enabled: true,
        method: 'basic' as const,
        users: [
          { username: 'testuser', password: 'testpass', permissions: ['*'] },
        ],
      };
      
      const authManager = new AuthManager(authConfig, logger);
      
      const result = await authManager.authenticate({
        username: 'testuser',
        password: 'testpass',
      });
      expect(result.success).toBe(true);
      expect(result.user).toBe('testuser');
      
      const invalidResult = await authManager.authenticate({
        username: 'testuser',
        password: 'wrongpass',
      });
      expect(invalidResult.success).toBe(false);
    });

}
