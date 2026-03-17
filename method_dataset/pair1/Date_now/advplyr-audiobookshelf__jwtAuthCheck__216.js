class __C__ {
  async jwtAuthCheck(jwt_payload, done) {
    if (jwt_payload.type === 'api') {
      // Api key based authentication
      const apiKey = await Database.apiKeyModel.getById(jwt_payload.keyId)

      if (!apiKey?.isActive) {
        done(null, null)
        return
      }

      // Check if the api key is expired and deactivate it
      if (jwt_payload.exp && jwt_payload.exp < Date.now() / 1000) {
        done(null, null)

        apiKey.isActive = false
        await apiKey.save()
        Logger.info(`[TokenManager] API key ${apiKey.id} is expired - deactivated`)
        return
      }

      const user = await Database.userModel.getUserById(apiKey.userId)
      done(null, user)
    } else {
      // JWT based authentication

      // Check if the jwt is expired
      if (jwt_payload.exp && jwt_payload.exp < Date.now() / 1000) {
        done(null, null)
        return
      }

      // load user by id from the jwt token
      const user = await Database.userModel.getUserByIdOrOldId(jwt_payload.userId)

      if (!user?.isActive) {
        // deny login
        done(null, null)
        return
      }

      // TODO: Temporary flag to report old tokens to users
      // May be a better place for this but here means we dont have to decode the token again
      if (!jwt_payload.exp && !user.isOldToken) {
        Logger.debug(`[TokenManager] User ${user.username} is using an access token without an expiration`)
        user.isOldToken = true
      } else if (jwt_payload.exp && user.isOldToken !== undefined) {
        delete user.isOldToken
      }

      // approve login
      done(null, user)
    }
  }

}
