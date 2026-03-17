class __C__ {
  async rotateTokensForSession(session, user, req, res) {
    // Generate new tokens
    const newAccessToken = this.generateTempAccessToken(user)
    const newRefreshToken = this.generateRefreshToken(user)

    // Calculate new expiration time
    const newExpiresAt = new Date(Date.now() + this.RefreshTokenExpiry * 1000)

    // Update the session with the new refresh token and expiration
    session.refreshToken = newRefreshToken
    session.expiresAt = newExpiresAt
    await session.save()

    // Set new refresh token cookie
    this.setRefreshTokenCookie(req, res, newRefreshToken)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }

}
