function __method_wrapper__() {
  async createApiKey(userId: string, keyData: {
    name: string;
    permissions?: Permission[];
    expiresAt?: Date;
  }): Promise<{ apiKey: ApiKey; key: string }> {
    const user = this.users.get(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    const key = this.generateApiKey();
    const keyHash = this.hashApiKey(key);
    const keyId = `key_${Date.now()}_${nanoid(8)}`;

    const permissions = keyData.permissions || user.permissions;

    const apiKey: ApiKey = {
      id: keyId,
      key: key.substring(0, 8) + '...',  // Store only prefix for display
      keyHash,
      name: keyData.name,
      permissions,
      expiresAt: keyData.expiresAt,
      isActive: true,
      createdAt: new Date(),
    };

    // Add to user's API keys
    user.apiKeys.push(apiKey);
    
    // Store in global API keys map
    this.apiKeys.set(keyId, apiKey);

    this.logger.info('API key created', {
      userId,
      keyId,
      keyName: keyData.name,
    });

    return { apiKey, key };
  }

}
