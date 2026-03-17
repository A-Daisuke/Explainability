function __method_wrapper__() {
  private async ensureValidOauthAccessToken(): Promise<string> {
    if (!this.oauthClient) {
      throw new Error("OAuth client not configured")
    }
    const {
      client,
      clientAuth,
      as,
    } = this.oauthClient

    let attempts = 0;
    const maxAttempts = 2;

    while (!this.oauthAccessToken || this.oauthAccessToken.expiresAt - Date.now() < 1000) {
      if (attempts > maxAttempts) {
        throw new Error("ran out of attempts trying to retrieve oauth access token");
      }
      if (attempts > 0) {
        // Wait for a short duration before retrying to avoid rapid retries
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const parameters = new URLSearchParams();
      if (this.scope && this.scope.length > 0) {
        parameters.set("scope", this.scope.join(" "));
      }
      parameters.set("project_id", this.projectId);
      parameters.set("environment", this.environment);
      try {
        const response = await oauth.clientCredentialsGrantRequest(as, client, clientAuth, parameters);
        const oauthTokenResponse = await oauth.processClientCredentialsResponse(as, client, response);
        this.oauthAccessToken = {
          token: oauthTokenResponse.access_token,
          expiresAt: Date.now() + (oauthTokenResponse.expires_in || 0) * 1000,
        };
      } catch {
        // pass
      }

      attempts++;
    }

    return this.oauthAccessToken.token;
  }

}
