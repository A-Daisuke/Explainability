const verifyEmailToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError('Email verification token is required', 400);
  }

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError('Invalid or expired email verification token', 400);
  }

  req.user = user;
  next();
});
