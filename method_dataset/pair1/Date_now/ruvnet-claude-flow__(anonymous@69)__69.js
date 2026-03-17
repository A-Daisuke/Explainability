function __method_wrapper__() {
  login: asyncHandler(async (req, res, next) => {
    const { email, password, rememberMe } = req.body;

    // Find user by credentials
    const user = await User.findByCredentials(email, password);

    // Check if email is verified (if verification is enabled)
    if (process.env.ENABLE_EMAIL_VERIFICATION === 'true' && !user.isEmailVerified) {
      throw new ApiError('Please verify your email before logging in', 401);
    }

    // Generate tokens
    const accessToken = authService.generateAccessToken(user);
    const deviceInfo = authService.extractDeviceInfo(req);
    const refreshToken = await authService.generateRefreshToken(user._id, deviceInfo);

    // Set cookie options
    const cookieExpiry = rememberMe ? 30 : parseInt(process.env.JWT_COOKIE_EXPIRE) || 7;
    const cookieOptions = {
      expires: new Date(Date.now() + cookieExpiry * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    logger.info(`User logged in: ${user.email}`);

    res.status(200)
      .cookie('token', accessToken, cookieOptions)
      .json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          accessToken,
          refreshToken,
        },
      });
  }),

}
