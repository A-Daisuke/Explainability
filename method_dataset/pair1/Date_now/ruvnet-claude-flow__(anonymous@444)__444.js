function __method_wrapper__() {
    it('should not reset with expired token', async () => {
      // Expire the token
      await Token.updateOne(
        { token: resetToken },
        { expiresAt: new Date(Date.now() - 1000) }
      );

      const response = await request(server)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          password: 'NewPassword123!',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('expired');
    });

}
