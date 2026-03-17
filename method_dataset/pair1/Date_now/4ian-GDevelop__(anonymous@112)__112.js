function __method_wrapper__() {
      (async () => {
        if (!shouldRegenerateToken) return;
        if (!userId) {
          clearStoredToken();
          return;
        }

        try {
          console.info(
            `Generating a custom token for user ${userId}, for usage in the Games Platform frame...`
          );
          const userCustomToken = await retryIfFailed({ times: 2 }, () =>
            generateCustomAuthToken(getAuthorizationHeader, userId)
          );
          setUserCustomToken(userCustomToken);
          setLastTokenGenerationTime(Date.now());
          setCustomTokenUserId(userId);
        } catch (error) {
          console.error(
            'Error while generating custom token. User will not be logged in the Games Platform frame.',
            error
          );
        }
      })();

}
