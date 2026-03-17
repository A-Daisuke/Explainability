const getNotificationPrimaryTextByType = (
  notification: Notification
): React.Node => {
  if (
    notification.type === 'credits-drop' &&
    notification.data.reason.startsWith('subscription')
  ) {
    return (
      <Trans>
        You received {notification.data.creditsAmount} credits thanks to your
        subscription
      </Trans>
    );
  }
  if (notification.type === 'one-game-feedback-received') {
    if (notification.data.playerName) {
      // Prevent prettier formatting that puts the first double quote at the end of the
      // previous line, adding a white space between the double quote and the comment.
      // prettier-ignore
      return (
        <Trans>
          Player {notification.data.playerName} left a feedback message on
          {notification.data.gameName}:
          "{shortenString(notification.data.comment, 25)}..."
        </Trans>
      );
    } else {
      // Prevent prettier formatting that puts the first double quote at the end of the
      // previous line, adding a white space between the double quote and the comment.
      // prettier-ignore
      return (
        <Trans>
          Your game {notification.data.gameName} received a feedback message:
          "{shortenString(notification.data.comment, 25)}..."
        </Trans>
      );
    }
  }
  if (notification.type === 'multiple-game-feedback-received') {
    return (
      <Trans>
        Your game {notification.data.gameName} received
        {notification.data.count} feedback messages
      </Trans>
    );
  }
  if (notification.type === 'free-trial-about-to-expire') {
    return (
      <Trans>
        Your free trial will expire in{' '}
        {Math.max(
          0,
          Math.round((notification.data.endDate - Date.now()) / (3600 * 1000))
        )}{' '}
        hours.
      </Trans>
    );
  }
  if (notification.type === 'claimable-asset-pack') {
    return (
      <Trans>
        The asset pack {notification.data.privateAssetPackName} is now
        available, go claim it in the shop!
      </Trans>
    );
  }
  if (notification.type === 'game-sessions-achievement') {
    if (notification.data.gameCount === 1) {
      if (notification.data.gameId && notification.data.gameName) {
        return (
          <Trans>
            Your game {notification.data.gameName} was played more than
            {notification.data.sessionsCount} times!
          </Trans>
        );
      } else return null; // should not happen.
    }
    if (notification.data.allGames) {
      return (
        <Trans>
          All your games were played more than {notification.data.sessionsCount}
          times in total!
        </Trans>
      );
    }
    const { gameCount } = notification.data;
    if (Number.isInteger(gameCount)) {
      return (
        <Trans>
          {gameCount} of your games were played more than
          {notification.data.sessionsCount} times in total!
        </Trans>
      );
    }
  }
  return null;
};
