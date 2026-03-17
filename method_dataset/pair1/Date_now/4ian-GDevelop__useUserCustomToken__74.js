const useUserCustomToken = (): {|
  userCustomToken: ?string,
|} => {
  const { profile, getAuthorizationHeader } = React.useContext(
    AuthenticatedUserContext
  );
  const userId = profile ? profile.id : null;

  const [customTokenUserId, setCustomTokenUserId] = React.useState(null);
  const [userCustomToken, setUserCustomToken] = React.useState(null);
  const [lastTokenGenerationTime, setLastTokenGenerationTime] = React.useState(
    0
  );

  // Regenerate a token every 30 minutes (expiration is usually 60 minutes, but be safe)
  // or if the user changed.
  const hasUserChanged = customTokenUserId !== userId;
  const shouldRegenerateToken =
    Date.now() - lastTokenGenerationTime > 1000 * 60 * 30 || hasUserChanged;

  const clearStoredToken = React.useCallback(() => {
    setUserCustomToken(null);
    setLastTokenGenerationTime(0);
    setCustomTokenUserId(null);
  }, []);

  React.useEffect(
    () => {
      if (hasUserChanged) {
        clearStoredToken();
        console.info('User has changed, cleared stored user custom token.');
      }
    },
    [hasUserChanged, clearStoredToken]
  );

  React.useEffect(
    () => {
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
    },
    [shouldRegenerateToken, userId, getAuthorizationHeader, clearStoredToken]
  );

  return { userCustomToken };
};
