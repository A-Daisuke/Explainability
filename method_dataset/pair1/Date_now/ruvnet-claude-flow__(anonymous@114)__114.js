function __method_wrapper__() {
  logout: asyncHandler(async (req, res, next) => {
    const { token } = req;

    // Blacklist the current token
    await authService.blacklistToken(token);

    // Remove refresh tokens for this device
    if (req.body.refreshToken) {
      await Token.findOneAndDelete({
        token: req.body.refreshToken,
        user: req.user._id,
        type: 'refresh',
      });
    }

    // Clear cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    logger.info(`User logged out: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }),

}
