function __method_wrapper__() {
    it('should apply exponential backoff with jitter', async () => {
      const clientWithJitter = new ClaudeAPIClient(mockLogger, mockConfigManager as any, {
        retryAttempts: 3,
        retryDelay: 100,
        retryJitter: true,
      });

      mockFetch.mockImplementation(() => Promise.resolve({
        ok: false,
        status: 500,
        text: async () => JSON.stringify({ 
          error: { message: 'Internal server error' } 
        }),
      }));

      const startTime = Date.now();
      
      await expect(
        clientWithJitter.sendMessage([{ role: 'user', content: 'Hello' }])
      ).rejects.toThrow();

      const elapsedTime = Date.now() - startTime;
      
      // With exponential backoff: 100ms + 200ms = 300ms minimum
      // With jitter, could be up to 30% more
      expect(elapsedTime).toBeGreaterThanOrEqual(300);
      expect(elapsedTime).toBeLessThan(600); // Reasonable upper bound
      
      clientWithJitter.destroy();
    });

}
