function __method_wrapper__() {
      {({ i18n }) => (
        <CardWidget onClick={disabled ? undefined : onClick} size={'large'}>
          {course && courseListingData ? (
            <Column expand noMargin noOverflowParent>
              <div style={styles.imageContainer}>
                <img
                  src={selectMessageByLocale(i18n, course.imageUrlByLocale)}
                  style={styles.image}
                  alt=""
                />
                {course.newUntil && course.newUntil > Date.now() && (
                  <div style={styles.newLabel}>
                    <Text color="inherit" noMargin displayInlineAsSpan>
                      <Trans>New</Trans>
                    </Text>
                  </div>
                )}
              </div>
              <div style={styles.cardTextContainer}>
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
                    <LineStackLayout alignItems="center" noMargin>
                      <span
                        style={{
                          ...styles.specializationDot,
                          backgroundColor: specializationConfig.color,
                        }}
                      />
                      <Text
                        displayInlineAsSpan
                        size="body-small"
                        noMargin
                        color="secondary"
                        style={textEllipsisStyle}
                      >
                        {specializationConfig.label}
                      </Text>
                    </LineStackLayout>
                    <LineStackLayout alignItems="center" noMargin>
                      <ColoredLinearProgress
                        value={
                          completion
                            ? (completion.completedChapters /
                                completion.chapters) *
                              100
                            : 0
                        }
                      />
                      <Text
                        displayInlineAsSpan
                        size="body-small"
                        noMargin
                        color="secondary"
                      >
                        {completion
                          ? `${completion.completedChapters}/${
                              completion.chapters
                            }`
                          : '-/-'}
                      </Text>
                    </LineStackLayout>

                    <Text
                      size="sub-title"
                      noMargin
                      color="primary"
                      align="left"
                    >
                      {selectMessageByLocale(i18n, course.titleByLocale)}
                    </Text>
                    <Text noMargin color="secondary" align="left">
                      {selectMessageByLocale(
                        i18n,
                        course.shortDescriptionByLocale
                      )}
                    </Text>
                  </ColumnStackLayout>
                  <div style={{ color: gdevelopTheme.text.color.secondary }}>
                    <Line justifyContent="space-between" alignItems="flex-end">
                      <Chip
                        style={{
                          ...styles.chip,
                          border: `1px solid ${getChipColorFromEnglishLevel(
                            course.levelByLocale.en
                          )}`,
                        }}
                        label={selectMessageByLocale(
                          i18n,
                          course.levelByLocale
                        )}
                        variant="outlined"
                      />
                      {getProductPriceOrOwnedLabel({
                        i18n,
                        productListingData: courseListingData,
                        usageType: 'default',
                        showBothPrices: 'column',
                        owned: !course.isLocked,
                        discountedPrice,
                      })}
                    </Line>
                  </div>
                </ColumnStackLayout>
              </div>
            </Column>
          ) : (
            <Column noMargin expand>
              <div style={styles.skeletonImageContainer}>
                <Skeleton variant="rect" height="100%" />
              </div>
              <Line expand>
                <Column expand>
                  <Skeleton height={20} />
                  <Skeleton height={20} />
                  <Skeleton height={30} />
                  <Skeleton height={100} />
                  <Skeleton height={50} />
                </Column>
              </Line>
            </Column>
          )}
        </CardWidget>
      )}

}
