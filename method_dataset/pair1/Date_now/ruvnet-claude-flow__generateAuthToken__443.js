function __method_wrapper__() {
  generateAuthToken(agentId: string, permissions: string[]): string {
    const tokenData = {
      agentId,
      permissions,
      issued: new Date(),
      expiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      nonce: this.crypto.generateNonce()
    };

    const token = this.crypto.hash(JSON.stringify(tokenData));
    
    this.authTokens.set(token, {
      agentId,
      expiry: tokenData.expiry,
      permissions
    });

    return token;
  }

}
