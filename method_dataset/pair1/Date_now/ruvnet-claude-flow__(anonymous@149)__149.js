function __method_wrapper__() {
    it('should retry with retry-after header', async () => {
      mockFetch.mockImplementation(() => Promise.resolve({
        ok: false,
        status: 429,
        text: async () => JSON.stringify({ 
          error: { 
            message: 'Rate limit exceeded',
            retry_after: 2, // 2 seconds
          } 
        }),
      }));

      const startTime = Date.now();
      
      await expect(
        client.sendMessage([{ role: 'user', content: 'Hello' }])
      ).rejects.toThrow(ClaudeRateLimitError);

      // Should respect retry-after header (but only for first retry)
      const elapsedTime = Date.now() - startTime;
      expect(elapsedTime).toBeGreaterThanOrEqual(2000); // At least 2 seconds
    });

}
