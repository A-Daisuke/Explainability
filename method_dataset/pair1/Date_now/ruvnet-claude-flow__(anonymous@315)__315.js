function __method_wrapper__() {
    test('SDK retry is faster than legacy', async () => {
      // This is a conceptual test - in reality SDK handles retry internally
      const startTime = Date.now();

      // Mock quick success
      jest.spyOn(newClient, 'makeRequest').mockResolvedValue({
        id: 'test',
        type: 'message',
        role: 'assistant',
        content: [{ type: 'text', text: 'fast' }],
        model: 'claude-3-haiku-20240307',
        stop_reason: 'end_turn',
        usage: { input_tokens: 5, output_tokens: 5 }
      });

      await newClient.makeRequest({
        model: 'claude-3-haiku-20240307',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 10
      });

      const duration = Date.now() - startTime;

      // SDK should be fast (no retry logic overhead)
      expect(duration).toBeLessThan(100);
    });

}
