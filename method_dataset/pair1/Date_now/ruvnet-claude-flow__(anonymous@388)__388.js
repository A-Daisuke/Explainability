function __method_wrapper__() {
    beforeEach(async () => {
      testUser = await User.create({
        email: 'test@example.com',
        password: 'OldPassword123!',
        name: 'Test User',
      });

      // Create reset token
      const tokenDoc = await Token.create({
        user: testUser._id,
        token: authService.generateSecureToken(),
        type: 'passwordReset',
        expiresAt: new Date(Date.now() + 3600000), // 1 hour
      });
      resetToken = tokenDoc.token;
    });

}
