function __method_wrapper__() {
  async authenticateSocket(socket, token) {
    // we don't use passport to authenticate the jwt we get over the socket connection.
    // it's easier to directly verify/decode it.
    // TODO: Support API keys for web socket connections
    const token_data = TokenManager.validateAccessToken(token)

    if (!token_data?.userId) {
      // Token invalid
      Logger.error('Cannot validate socket - invalid token')
      return socket.emit('auth_failed', { message: 'Invalid token' })
    }

    // get the user via the id from the decoded jwt.
    const user = await Database.userModel.getUserByIdOrOldId(token_data.userId)
    if (!user) {
      // user not found
      Logger.error('Cannot validate socket - invalid token')
      return socket.emit('auth_failed', { message: 'Invalid token' })
    }
    if (!user.isActive) {
      Logger.error('Cannot validate socket - user is not active')
      return socket.emit('auth_failed', { message: 'Invalid user' })
    }

    const client = this.clients[socket.id]
    if (!client) {
      Logger.error(`[SocketAuthority] Socket for user ${user.username} has no client`)
      return
    }

    if (client.user !== undefined) {
      if (client.user.id === user.id) {
        // Allow re-authentication of a socket to the same user
        Logger.info(`[SocketAuthority] Authenticating socket already associated to user "${client.user.username}"`)
      } else {
        // Allow re-authentication of a socket to a different user but shouldn't happen
        Logger.warn(`[SocketAuthority] Authenticating socket to user "${user.username}", but is already associated with a different user "${client.user.username}"`)
      }
    } else {
      Logger.debug(`[SocketAuthority] Authenticating socket to user "${user.username}"`)
    }

    client.user = user
    this.adminEmitter('user_online', client.user.toJSONForPublic(this.Server.playbackSessionManager.sessions))

    // Update user lastSeen without firing sequelize bulk update hooks
    user.lastSeen = Date.now()
    await user.save({ hooks: false })

    const initialPayload = {
      userId: client.user.id,
      username: client.user.username
    }
    if (user.isAdminOrUp) {
      initialPayload.usersOnline = this.getUsersOnline()
    }
    client.socket.emit('init', initialPayload)
  }

}
