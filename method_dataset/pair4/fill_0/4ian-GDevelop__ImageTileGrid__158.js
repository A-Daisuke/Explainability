const ImageTileGrid = ({
  items,
  isLoading,
  getColumnsFromWindowSize,
  getLimitFromWindowSize,
}: ImageTileGridProps) => {
  const { windowSize, isLandscape } = useResponsiveWindowSize();
  const MAX_COLUMNS = getColumnsFromWindowSize('xlarge', isLandscape);
  const limit = getLimitFromWindowSize
    ? getLimitFromWindowSize(windowSize, isLandscape)
    : undefined;
  const itemsToDisplay = limit ? items.slice(0, limit) : items;
  const forceUpdate = useForceUpdate();
  const isMounted = useIsMounted();

  const loadedImageUrls = React.useRef<Set<string>>(new Set<string>());
  const setImageLoaded = React.useCallback(
    (loadedImageUrl: string) => {
      // Give a bit of time to an image to fully render before revealing it.
      setTimeout(() => {
        if (!isMounted) return; // Avoid warnings if the component was removed in the meantime.

        loadedImageUrls.current.add(loadedImageUrl);
        forceUpdate();
      }, 50);
    },
    [forceUpdate, isMounted]
  );

  const columns = getColumnsFromWindowSize(windowSize, isLandscape);

  return (
    <Line noMargin>
      <GridList
        cols={columns}
        style={{
          flex: 1,
          maxWidth: (LARGE_WIDGET_SIZE + 2 * SPACING) * MAX_COLUMNS, // Avoid tiles taking too much space on large screens.
        }}
        cellHeight="auto"
        spacing={SPACING * 2}
      >
        {isLoading
          ? new Array(columns).fill(0).map((_, index) => (
              // Display tiles but with skeletons while the data is loading.
              <GridListTile key={index}>
                <Skeleton
                  variant="rect"
                  width="100%"
                  height="100%"
                  style={styles.dataLoadingSkeleton}
                />
              </GridListTile>
            ))
          : itemsToDisplay.map((item, index) => (
              <GridListTile key={index}>
                <CardWidget onClick={item.onClick} size="large">
                  <Column expand noMargin>
                    <div style={styles.imageContainer}>
                      {!loadedImageUrls.current.has(item.imageUrl) ? (
                        // Display a skeleton behind the image while it's loading.
                        <Skeleton
                          variant="rect"
                          width="100%"
                          height="100%"
                          style={styles.imageLoadingSkeleton}
                        />
                      ) : null}
                      <CorsAwareImage
                        style={{
                          // Once ready, animate the image display.
                          opacity: loadedImageUrls.current.has(item.imageUrl)
                            ? 1
                            : 0,
                          ...styles.thumbnailImageWithDescription,
                        }}
                        src={item.imageUrl}
                        alt={`thumbnail ${index}`}
                        onLoad={() => setImageLoaded(item.imageUrl)}
                      />
                      {item.overlayText && (
                        <ImageOverlay
                          content={item.overlayText}
                          position={item.overlayTextPosition || 'bottomRight'}
                        />
                      )}
                      {item.isLocked && <LockedOverlay />}
                    </div>
                    <div style={styles.textContainer}>
                      <ColumnStackLayout
                        noMargin
                        expand
                        justifyContent="space-between"
                        useFullHeight
                        noOverflowParent
                      >
                        <ColumnStackLayout
                          noMargin
                          expand
                          justifyContent="flex-start"
                          useFullHeight
                          noOverflowParent
                        >
                          {item.title && (
                            <Text size="sub-title" noMargin align="left">
                              {item.title}
                            </Text>
                          )}
                          {item.description && (
                            <Text
                              size="body"
                              color="secondary"
                              noMargin
                              align="left"
                            >
                              {shortenString(item.description, 115)}
                            </Text>
                          )}
                        </ColumnStackLayout>
                        {item.chipText && (
                          <Line
                            justifyContent="space-between"
                            alignItems="flex-end"
                          >
                            <Chip
                              style={{
                                ...styles.chip,
                                border: `1px solid ${item.chipColor ||
                                  '#3BF7F4'}`,
                              }}
                              label={item.chipText}
                              variant="outlined"
                            />
                          </Line>
                        )}
                      </ColumnStackLayout>
                    </div>
                  </Column>
                </CardWidget>
              </GridListTile>
            ))}
      </GridList>
    </Line>
  );
};
