function __method_wrapper__() {
    it('should blacklist token in Redis', async () => {
      const token = 'jwt-token';
      const mockRedis = {
        setex: jest.fn().mockResolvedValue('OK'),
      };
      getRedisClient.mockReturnValue(mockRedis);
      jwt.decode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 });

      await authService.blacklistToken(token);

      expect(mockRedis.setex).toHaveBeenCalledWith(
        `blacklist_${token}`,
        expect.any(Number),
        '1'
      );
    });

}
