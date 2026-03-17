function __method_wrapper__() {
      {({ i18n }) => (
        <GridList
          cols={columnsCount}
          style={styles.grid}
          cellHeight="auto"
          spacing={ITEMS_SPACING * 2}
        >
          {displayedExampleShortHeaders
            ? displayedExampleShortHeaders.map(
                ({ exampleShortHeader, thumbnailTitleByLocale }) => (
                  <ExampleTile
                    exampleShortHeader={exampleShortHeader}
                    onSelect={() => {
                      onSelectExampleShortHeader(exampleShortHeader);
                    }}
                    customTitle={selectMessageByLocale(
                      i18n,
                      thumbnailTitleByLocale
                    )}
                    key={exampleShortHeader.name}
                    useQuickCustomizationThumbnail
                  />
                )
              )
            : new Array(quickCustomizationRecommendation.list.length)
                .fill(0)
                .map((_, index) => (
                  <ExampleTile
                    exampleShortHeader={null}
                    onSelect={() => {}}
                    key={`skeleton-${index}`}
                  />
                ))}
        </GridList>
      )}

}
