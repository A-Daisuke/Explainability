const BuildProgressAndActions = ({
  build,
  game,
  onGameUpdated,
  gameUpdating,
  setGameUpdating,
  onCopyToClipboard,
}: Props) => {
  const { getAuthorizationHeader, profile } = React.useContext(
    AuthenticatedUserContext
  );
  const config = buildTypesConfig[build.type];
  const estimatedTime = config.estimatedTimeInSeconds(build);
  const secondsSinceLastUpdate = Math.abs(
    differenceInSeconds(build.updatedAt, Date.now())
  );
  const estimatedRemainingTime = estimatedTime - secondsSinceLastUpdate;
  const isStillWithinEstimatedTime = estimatedRemainingTime > 0;
  const hasJustOverrun =
    !isStillWithinEstimatedTime && estimatedRemainingTime >= -estimatedTime;
  const hasTimedOut =
    !isStillWithinEstimatedTime && estimatedRemainingTime < -estimatedTime;
  const onDownload = (key: BuildArtifactKeyName) => {
    const url = getBuildArtifactUrl(build, key);
    if (url) Window.openExternalURL(url);
  };

  const onCopyBuildLink = () => {
    const url = getBuildArtifactUrl(build, 's3Key');
    if (url) navigator.clipboard.writeText(url);
    onCopyToClipboard && onCopyToClipboard();
  };

  const onUpdatePublicBuild = React.useCallback(
    async (buildId: ?string, i18n: I18nType) => {
      if (!profile || !game || !onGameUpdated || !setGameUpdating) return;

      const { id } = profile;
      const answer = Window.showConfirmDialog(
        buildId
          ? i18n._(
              t`"${build.name ||
                shortenUuidForDisplay(
                  build.id
                )}" will be the new build of this game published on gd.games. Continue?`
            )
          : i18n._(
              t`"${build.name ||
                shortenUuidForDisplay(
                  build.id
                )}" will be unpublished on gd.games. Continue?`
            )
      );
      if (!answer) return;
      try {
        setGameUpdating(true);
        const updatedGame = await updateGame(
          getAuthorizationHeader,
          id,
          game.id,
          {
            publicWebBuildId: buildId,
          }
        );
        onGameUpdated(updatedGame);
      } catch (err) {
        console.error('Unable to update the game', err);
      } finally {
        setGameUpdating(false);
      }
    },
    [
      profile,
      game,
      onGameUpdated,
      setGameUpdating,
      build.name,
      build.id,
      getAuthorizationHeader,
    ]
  );

  const isBuildPublished = !!game && game.publicWebBuildId === build.id;

  return (
    <I18n>
      {({ i18n }) =>
        build.status === 'error' ? (
          <ResponsiveLineStackLayout
            alignItems="center"
            justifyContent="space-between"
            expand
          >
            <Column noMargin>
              <Text noMargin>
                <Trans>Something wrong happened :(</Trans>
              </Text>
              <EmptyMessage
                style={{ justifyContent: 'flex-start', padding: 0 }}
              >
                <Trans>
                  Check the logs to see if there is an explanation about what
                  went wrong, or try again later.
                </Trans>
              </EmptyMessage>
            </Column>
            <RaisedButton
              primary
              label={<Trans>Download log files</Trans>}
              onClick={() => onDownload('logsKey')}
            />
          </ResponsiveLineStackLayout>
        ) : build.status === 'pending' ? (
          <>
            <Line alignItems="center" expand justifyContent="center">
              {(isStillWithinEstimatedTime || hasJustOverrun) && (
                <>
                  <LinearProgress
                    value={
                      isStillWithinEstimatedTime
                        ? ((estimatedTime - estimatedRemainingTime) /
                            estimatedTime) *
                          100
                        : 0
                    }
                    variant={
                      isStillWithinEstimatedTime
                        ? 'determinate'
                        : 'indeterminate'
                    }
                  />
                  <Spacer />
                </>
              )}
              {isStillWithinEstimatedTime && (
                <Text>
                  <Trans>
                    ~{Math.round(estimatedRemainingTime / 60)} minutes.
                  </Trans>
                </Text>
              )}
              {hasJustOverrun && (
                <Text>
                  <Trans>Should finish soon.</Trans>
                </Text>
              )}
            </Line>
            {hasTimedOut && (
              <Column>
                <Line justifyContent="flex-end" noMargin>
                  <Text noMargin>
                    <Trans>Something wrong happened :(</Trans>
                  </Text>
                </Line>
                <Line justifyContent="flex-end" noMargin>
                  <EmptyMessage
                    style={{ justifyContent: 'flex-end', padding: 0 }}
                  >
                    <Trans>
                      It looks like the build has timed out, please try again.
                    </Trans>
                  </EmptyMessage>
                </Line>
              </Column>
            )}
          </>
        ) : build.status === 'complete' ? (
          <ColumnStackLayout noMargin expand>
            <ResponsiveLineStackLayout
              expand
              justifyContent="space-between"
              alignItems="center"
              noMargin
            >
              <ResponsiveLineStackLayout
                noMargin
                noColumnMargin
                alignItems="center"
              >
                {game && !!build.s3Key && (
                  <>
                    <Toggle
                      label={<Trans>Publish this build on gd.games</Trans>}
                      labelPosition="left"
                      toggled={isBuildPublished}
                      onToggle={() => {
                        onUpdatePublicBuild(
                          isBuildPublished ? null : build.id,
                          i18n
                        );
                      }}
                      disabled={gameUpdating}
                    />
                    <Spacer />
                    <TextButton
                      label={<Trans>Copy build link</Trans>}
                      icon={<Copy />}
                      onClick={onCopyBuildLink}
                    />
                  </>
                )}
                {downloadButtons
                  .filter(button => !!build[button.key])
                  .map(button => (
                    <React.Fragment key={button.key}>
                      <RaisedButton
                        primary
                        label={i18n._(button.displayName)}
                        onClick={() => onDownload(button.key)}
                        icon={button.icon}
                      />
                      <Spacer />
                    </React.Fragment>
                  ))}
              </ResponsiveLineStackLayout>
              <FlatButton
                label={<Trans>Download log files</Trans>}
                onClick={() => onDownload('logsKey')}
              />
            </ResponsiveLineStackLayout>
            {config && config.completeDescription && (
              <Line expand justifyContent="flex-start" noMargin>
                <Text noMargin size="body2">
                  {config.completeDescription}
                </Text>
              </Line>
            )}
          </ColumnStackLayout>
        ) : (
          <Line>
            <Trans>Unknown status</Trans>
          </Line>
        )
      }
    </I18n>
  );
};
