function __method_wrapper__() {
  async createTokensAndSession(user, req) {
    const ipAddress = requestIp.getClientIp(req)
    const userAgent = req.headers['user-agent']
    const accessToken = this.generateTempAccessToken(user)
    const refreshToken = this.generateRefreshToken(user)

    // Calculate expiration time for the refresh token
    const expiresAt = new Date(Date.now() + this.RefreshTokenExpiry * 1000)

    const session = await Database.sessionModel.createSession(user.id, ipAddress, userAgent, refreshToken, expiresAt)

    return {
      accessToken,
      refreshToken,
      session
    }
  }

}
