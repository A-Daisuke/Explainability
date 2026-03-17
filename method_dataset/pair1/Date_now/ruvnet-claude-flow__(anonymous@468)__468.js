function __method_wrapper__() {
    beforeEach(async () => {
      testUser = await User.create({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
        isEmailVerified: false,
      });

      // Create verification token
      const tokenDoc = await Token.create({
        user: testUser._id,
        token: authService.generateSecureToken(),
        type: 'emailVerification',
        expiresAt: new Date(Date.now() + 86400000), // 24 hours
      });
      verificationToken = tokenDoc.token;
    });

}
