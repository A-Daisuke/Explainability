class __C__ {
  async blacklistToken(token, ttl = null) {
    const redis = getRedisClient();
    if (!redis) {
      logger.warn('Redis not available for token blacklisting');
      return;
    }

    try {
      let expiry = ttl;
      if (!expiry) {
        // Get token expiry time
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp) {
          expiry = decoded.exp - Math.floor(Date.now() / 1000);
        } else {
          expiry = 7 * 24 * 60 * 60; // Default 7 days
        }
      }

      await redis.setex(`blacklist_${token}`, expiry, '1');
      logger.info('Token blacklisted successfully');
    } catch (error) {
      logger.error('Error blacklisting token:', error);
    }
  }

}
