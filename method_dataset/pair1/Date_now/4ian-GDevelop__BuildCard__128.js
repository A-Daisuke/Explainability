export const BuildCard = ({
  build,
  game,
  onGameUpdated,
  gameUpdating,
  setGameUpdating,
  onBuildUpdated,
  onBuildDeleted,
  authenticatedUser,
}: Props) => {
  const { getAuthorizationHeader, profile } = authenticatedUser;
  const defaultBuildName = `${game.gameName
    .toLowerCase()
    .replace(/ /g, '-')
    .slice(
      0,
      BUILD_NAME_MAX_LENGTH - BUILD_DEFAULT_NAME_TIME_FORMAT.length - 1
    )}-${format(build.updatedAt, BUILD_DEFAULT_NAME_TIME_FORMAT)}`;
  const buildName = build.name ? build.name : defaultBuildName;
  const isOnlineBuild = game.publicWebBuildId === build.id;
  const isOld =
    build &&
    build.type !== 'web-build' &&
    differenceInCalendarDays(Date.now(), build.updatedAt) > 6;

  const gdevelopTheme = React.useContext(GDevelopThemeContext);
  const nameInput = React.useRef<?TextFieldInterface>(null);
  const { isMobile } = useResponsiveWindowSize();

  const [showCopiedInfoBar, setShowCopiedInfoBar] = React.useState(false);

  const [isEditingName, setIsEditingName] = React.useState(false);
  const [name, setName] = React.useState(buildName);

  const onCopyUuid = () => {
    navigator.clipboard.writeText(build.id);
    setShowCopiedInfoBar(true);
  };

  const onEditName = () => {
    setIsEditingName(true);
    nameInput.current && nameInput.current.focus();
  };
  const onBlurEditName = async (i18n: I18nType) => {
    if (!profile) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
      setName(build.name || '');
    } else if (trimmedName === buildName) {
      setName(name.trim());
    } else {
      try {
        setGameUpdating(true);
        const updatedBuild = await updateBuild(
          getAuthorizationHeader,
          profile.id,
          build.id,
          {
            name: name,
          }
        );
        onBuildUpdated({
          ...build,
          name: updatedBuild.name,
        });
      } catch (error) {
        setName(build.name || '');
        showErrorBox({
          message: i18n._(
            t`Could not update the build name. Verify your internet connection or try again later.`
          ),
          rawError: error,
          errorId: 'build-name-update-error',
        });
      } finally {
        setGameUpdating(false);
      }
    }
    setIsEditingName(false);
  };

  const onDeleteBuild = async (i18n: I18nType) => {
    if (!profile) return;
    const answer = Window.showConfirmDialog(
      'You are about to delete this build. Continue?'
    );
    if (!answer) return;
    try {
      setGameUpdating(true);
      await deleteBuild(getAuthorizationHeader, profile.id, build.id);
      setGameUpdating(false);
      onBuildDeleted(build);
    } catch (error) {
      showErrorBox({
        message: i18n._(
          t`Could not delete the build. Verify your internet connection or try again later.`
        ),
        rawError: error,
        errorId: 'build-delete-error',
      });
      setGameUpdating(false);
    }
  };

  return (
    <I18n>
      {({ i18n }) => (
        <>
          <Card
            isHighlighted={isOnlineBuild}
            cardCornerAction={
              <ElementWithMenu
                element={
                  <IconButton size="small" disabled={gameUpdating}>
                    <ThreeDotsMenu />
                  </IconButton>
                }
                buildMenuTemplate={(i18n: I18nType) => [
                  {
                    label: i18n._(t`Edit build name`),
                    click: onEditName,
                  },
                  { type: 'separator' },
                  {
                    label: i18n._(t`Delete build`),
                    click: () => onDeleteBuild(i18n),
                  },
                ]}
              />
            }
            header={
              <LineStackLayout
                noMargin
                alignItems="center"
                justifyContent="space-between"
              >
                {!isMobile && <BuildAndCreatedAt build={build} />}
                <Column expand noMargin justifyContent="center">
                  <Line noMargin justifyContent="end">
                    {isOnlineBuild ? (
                      <Text size="body2">
                        <Trans>Current build online</Trans>
                      </Text>
                    ) : (
                      game.acceptsBuildComments &&
                      build.type === 'web-build' && (
                        <LineStackLayout alignItems="center" noMargin>
                          <div
                            style={{
                              ...styles.openForFeedbackIndicator,
                              backgroundColor: gdevelopTheme.message.valid,
                            }}
                          />
                          <Text size="body2">
                            <Trans>Build open for feedbacks</Trans>
                          </Text>
                        </LineStackLayout>
                      )
                    )}
                  </Line>
                </Column>
              </LineStackLayout>
            }
          >
            <Column expand noMargin>
              {isMobile && <BuildAndCreatedAt build={build} />}
              <Spacer />
              <Line noMargin>
                {isEditingName ? (
                  <Line noMargin expand>
                    <TextField
                      ref={nameInput}
                      style={styles.textField}
                      value={name}
                      margin="none"
                      onChange={(_, value) => setName(value)}
                      onBlur={() => {
                        onBlurEditName(i18n);
                      }}
                      hintText={buildName}
                      disabled={gameUpdating}
                      onKeyPress={event => {
                        if (shouldValidate(event) && nameInput.current)
                          nameInput.current.blur();
                      }}
                      onKeyDown={event => {
                        if (shouldCloseOrCancel(event)) {
                          event.stopPropagation();
                          setIsEditingName(false);
                          setName(buildName);
                        }
                      }}
                      maxLength={BUILD_NAME_MAX_LENGTH}
                    />
                    {gameUpdating && (
                      <>
                        <Spacer />
                        <CircularProgress style={styles.circularProgress} />
                      </>
                    )}
                  </Line>
                ) : (
                  <Line noMargin alignItems="baseline">
                    <Text noMargin>{buildName}</Text>
                  </Line>
                )}
              </Line>
              <Line noMargin alignItems="center">
                <BackgroundText style={{ textAlign: 'left' }}>
                  {build.id}
                </BackgroundText>
                <Spacer />
                <IconButton size="small" onClick={onCopyUuid}>
                  <Copy style={styles.buildButtonIcon} />
                </IconButton>
              </Line>
              <LargeSpacer />
              <Line expand noMargin justifyContent="space-between">
                {!isOld && (
                  <BuildProgressAndActions
                    build={build}
                    game={game}
                    onGameUpdated={onGameUpdated}
                    gameUpdating={gameUpdating}
                    setGameUpdating={setGameUpdating}
                    onCopyToClipboard={() => setShowCopiedInfoBar(true)}
                  />
                )}
                {isOld && (
                  <EmptyMessage>
                    <Trans>
                      This build is old and the generated games can't be
                      downloaded anymore.
                    </Trans>
                  </EmptyMessage>
                )}
              </Line>
            </Column>
          </Card>
          <InfoBar
            visible={showCopiedInfoBar}
            hide={() => setShowCopiedInfoBar(false)}
            message={<Trans>Copied to clipboard!</Trans>}
          />
        </>
      )}
    </I18n>
  );
};
