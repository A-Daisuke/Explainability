class __C__ {
  async create(req, res) {
    if (!req.body.name || typeof req.body.name !== 'string') {
      Logger.warn(`[ApiKeyController] create: Invalid name: ${req.body.name}`)
      return res.sendStatus(400)
    }
    if (req.body.expiresIn && (typeof req.body.expiresIn !== 'number' || req.body.expiresIn <= 0)) {
      Logger.warn(`[ApiKeyController] create: Invalid expiresIn: ${req.body.expiresIn}`)
      return res.sendStatus(400)
    }
    if (!req.body.userId || typeof req.body.userId !== 'string') {
      Logger.warn(`[ApiKeyController] create: Invalid userId: ${req.body.userId}`)
      return res.sendStatus(400)
    }
    const user = await Database.userModel.getUserById(req.body.userId)
    if (!user) {
      Logger.warn(`[ApiKeyController] create: User not found: ${req.body.userId}`)
      return res.sendStatus(400)
    }
    if (user.type === 'root' && !req.user.isRoot) {
      Logger.warn(`[ApiKeyController] create: Root user API key cannot be created by non-root user`)
      return res.sendStatus(403)
    }

    const keyId = uuidv4() // Generate key id ahead of time to use in JWT
    const apiKey = await Database.apiKeyModel.generateApiKey(this.auth.tokenManager.TokenSecret, keyId, req.body.name, req.body.expiresIn)

    if (!apiKey) {
      Logger.error(`[ApiKeyController] create: Error generating API key`)
      return res.sendStatus(500)
    }

    // Calculate expiration time for the api key
    const expiresAt = req.body.expiresIn ? new Date(Date.now() + req.body.expiresIn * 1000) : null

    const apiKeyInstance = await Database.apiKeyModel.create({
      id: keyId,
      name: req.body.name,
      expiresAt,
      userId: req.body.userId,
      isActive: !!req.body.isActive,
      createdByUserId: req.user.id
    })
    apiKeyInstance.dataValues.user = await apiKeyInstance.getUser({
      attributes: ['id', 'username', 'type']
    })

    Logger.info(`[ApiKeyController] Created API key "${apiKeyInstance.name}"`)
    return res.json({
      apiKey: {
        apiKey, // Actual key only shown to user on creation
        ...apiKeyInstance.toJSON()
      }
    })
  }

}
