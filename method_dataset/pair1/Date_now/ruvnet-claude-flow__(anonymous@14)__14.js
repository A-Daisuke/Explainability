function __method_wrapper__() {
  register: asyncHandler(async (req, res, next) => {
    const { email, password, name, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError('User already exists with this email', 400);
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      phone,
      address,
    });

    // Generate tokens
    const accessToken = authService.generateAccessToken(user);
    const deviceInfo = authService.extractDeviceInfo(req);
    const refreshToken = await authService.generateRefreshToken(user._id, deviceInfo);

    // Generate email verification token
    if (process.env.ENABLE_EMAIL_VERIFICATION === 'true') {
      const verificationToken = await Token.createEmailVerificationToken(user._id);
      await authService.sendVerificationEmail(user, verificationToken.token);
    }

    // Set cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res.status(201)
      .cookie('token', accessToken, cookieOptions)
      .json({
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        data: {
          user,
          accessToken,
          refreshToken,
        },
      });
  }),

}
