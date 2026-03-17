const TeamMemberProjectsView = ({
  user,
  currentFileMetadata,
  onClickBack,
  onOpenRecentFile,
  storageProviders,
  projects,
  onRefreshProjects,
  isLoadingProjects,
}: Props) => {
  const { isMobile } = useResponsiveWindowSize();
  const skeletonLineHeight = getProjectLineHeight({ isMobile });
  const contextMenu = React.useRef<?ContextMenuInterface>(null);

  const fileMetadataAndStorageProviderNames = projects
    ? transformCloudProjectsIntoFileMetadataWithStorageProviderName(
        projects,
        user.id
      )
    : null;

  const buildContextMenu = (
    i18n: I18nType,
    file: ?FileMetadataAndStorageProviderName
  ): Array<MenuItemTemplate> => {
    if (!file) return [];
    return [{ label: i18n._(t`Open`), click: () => onOpenRecentFile(file) }];
  };

  const openContextMenu = React.useCallback(
    (event: ClientCoordinates, file: FileMetadataAndStorageProviderName) => {
      if (contextMenu.current) {
        contextMenu.current.open(event.clientX, event.clientY, { file });
      }
    },
    []
  );

  return (
    <SectionContainer
      title={<Trans>{user.username || user.email}'s projects</Trans>}
      titleAdornment={
        <FlatButton
          primary
          disabled={isLoadingProjects}
          label={
            isMobile ? <Trans>Refresh</Trans> : <Trans>Refresh dashboard</Trans>
          }
          onClick={() => onRefreshProjects(user)}
          leftIcon={<Refresh fontSize="small" />}
        />
      }
      backAction={onClickBack}
    >
      <SectionRow>
        {!isMobile && (
          <Line justifyContent="space-between">
            <Column expand>
              <Text color="secondary">
                <Trans>File name</Trans>
              </Text>
            </Column>
            <Column expand>
              <Text color="secondary">
                <Trans>Location</Trans>
              </Text>
            </Column>
            <Column expand>
              <Text color="secondary">
                <Trans>Last edited</Trans>
              </Text>
            </Column>
          </Line>
        )}
        <Line>
          <Column noMargin expand>
            {!fileMetadataAndStorageProviderNames ? (
              <List>
                {new Array(5).fill(0).map((_, index) => (
                  <ListItem style={styles.listItem} key={`skeleton-${index}`}>
                    <Line expand>
                      <Column expand>
                        <Skeleton
                          variant="rect"
                          height={skeletonLineHeight}
                          width={'100%'}
                          style={styles.skeleton}
                        />
                      </Column>
                    </Line>
                  </ListItem>
                ))}
              </List>
            ) : fileMetadataAndStorageProviderNames.length === 0 ? (
              <>
                <EmptyMessage>
                  <Trans>This user does not have projects yet.</Trans>
                </EmptyMessage>
                <AlertMessage kind="info">
                  <Trans>
                    Only cloud projects can be displayed here. If the user has
                    created local projects, they need to be saved as cloud
                    projects to be visible.
                  </Trans>
                </AlertMessage>
              </>
            ) : (
              <List>
                {fileMetadataAndStorageProviderNames.map(file => (
                  <ProjectFileListItem
                    file={file}
                    currentFileMetadata={currentFileMetadata}
                    key={file.fileMetadata.fileIdentifier}
                    disabled={false}
                    isLoading={false}
                    onOpenContextMenu={openContextMenu}
                    onOpenProject={onOpenRecentFile}
                    storageProviders={storageProviders}
                    isWindowSizeMediumOrLarger={!isMobile}
                  />
                ))}
              </List>
            )}
          </Column>
        </Line>
      </SectionRow>
      <ContextMenu
        ref={contextMenu}
        buildMenuTemplate={(_i18n, { file }) => buildContextMenu(_i18n, file)}
      />
    </SectionContainer>
  );
};
