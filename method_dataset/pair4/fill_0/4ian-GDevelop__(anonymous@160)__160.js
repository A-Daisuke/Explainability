function __method_wrapper__() {
      {({ i18n }) => (
        <SectionContainer
          chipText={<Trans>Start for free</Trans>}
          title={<Trans>Official Game Dev courses</Trans>}
          titleAdornment={
            <Line noMargin justifyContent="flex-end">
              <FlatButton
                onClick={() => onSelectCategory('all-courses')}
                label={<Trans>See all</Trans>}
                rightIcon={<ArrowRight fontSize="small" />}
              />
            </Line>
          }
          subtitleText={
            <Trans>
              Break into the{' '}
              <Link
                href={'https://gdevelop.io/blog/indie-mobile-creators-2025'}
                onClick={() =>
                  Window.openExternalURL(
                    'https://gdevelop.io/blog/indie-mobile-creators-2025'
                  )
                }
              >
                booming industry
              </Link>{' '}
              of casual gaming. Sharpen your skills and become a professional.
              Start for free:
            </Trans>
          }
          customPaperStyle={{
            backgroundAttachment: 'local',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top',
            backgroundSize: isMobile && !isLandscape ? 'contain' : 'auto',
            backgroundImage: `url('res/premium/premium_dialog_background.png'),${
              paletteType === 'dark'
                ? 'linear-gradient(180deg, #322659 0px, #3F2458 20px, #1D1D26 200px, #1D1D26 100%)'
                : 'linear-gradient(180deg, #CBBAFF 0px, #DEBBFF 20px, #F5F5F7 200px, #F5F5F7 100%)'
            }`,
          }}
        >
          <SectionRow>
            <Line>
              <Carousel
                items={
                  displayedCourses && listedCourses
                    ? displayedCourses.map(course => {
                        const completion = getCourseCompletion(course.id);
                        const courseListingData = listedCourses.find(
                          listedCourse => listedCourse.id === course.id
                        );
                        return {
                          renderItem: () => (
                            <GridListTile key={course.id}>
                              <CourseCard
                                course={course}
                                courseListingData={courseListingData}
                                completion={completion}
                                onClick={() => {
                                  if (!courseListingData) return;
                                  onSelectCourse(courseListingData);
                                }}
                              />
                            </GridListTile>
                          ),
                        };
                      })
                    : new Array(6).fill(0).map((_, index) => ({
                        renderItem: () => (
                          <GridListTile key={`skeleton-course-${index}`}>
                            <CourseCard
                              course={null}
                              courseListingData={null}
                              completion={null}
                            />
                          </GridListTile>
                        ),
                      }))
                }
              />
            </Line>
          </SectionRow>
          {!hidePremiumProducts && (
            <SectionRow>
              <BundlePreviewBanner
                onDisplayBundle={onSelectBundle}
                category="starter"
                i18n={i18n}
              />
            </SectionRow>
          )}
          <SectionRow>
            <LineStackLayout
              justifyContent="space-between"
              alignItems="center"
              noMargin
              expand
            >
              <Column noMargin>
                <Text size="section-title">
                  <Trans>Free in-app tutorials</Trans>
                </Text>
              </Column>
              <Column noMargin>
                <FlatButton
                  onClick={() => onSelectCategory('in-app-tutorials')}
                  label={<Trans>See all</Trans>}
                  rightIcon={<ArrowRight fontSize="small" />}
                />
              </Column>
            </LineStackLayout>
            <GuidedLessons
              selectInAppTutorial={selectInAppTutorial}
              displayAsCarousel
            />
          </SectionRow>
          <SectionRow>
            <TutorialsRow
              limits={limits}
              category="all-tutorials"
              onSelectCategory={onSelectCategory}
              onSelectTutorial={setSelectedTutorial}
              getColumnsFromWindowSize={getColumnsFromWindowSize}
            />
          </SectionRow>
          <SectionRow>
            <LineStackLayout
              noMargin
              alignItems="center"
              justifyContent="space-between"
            >
              <Column noMargin expand>
                <Text size="section-title">
                  <Trans>Learn by dissecting ready-made games</Trans>
                </Text>
              </Column>
              <Column noMargin expand>
                <Line noMargin justifyContent="flex-end">
                  <FlatButton
                    onClick={onOpenNewProjectSetupDialog}
                    label={<Trans>See all</Trans>}
                    rightIcon={<ArrowRight fontSize="small" />}
                  />
                </Line>
              </Column>
            </LineStackLayout>
            <Spacer />
            <ExampleStore
              onSelectExampleShortHeader={onSelectExampleShortHeader}
              onSelectPrivateGameTemplateListingData={
                onSelectPrivateGameTemplateListingData
              }
              i18n={i18n}
              getColumnsFromWindowSize={getColumnsFromWindowSize}
              hideSearch
              onlyShowGames
              hidePremiumTemplates
              limitRowsTo={1}
            />
          </SectionRow>
          <SectionRow>
            <TutorialsRow
              limits={limits}
              category="full-game"
              onSelectCategory={onSelectCategory}
              onSelectTutorial={setSelectedTutorial}
              getColumnsFromWindowSize={getColumnsFromWindowSize}
            />
          </SectionRow>
          <SectionRow>
            <LineStackLayout
              justifyContent="space-between"
              alignItems="center"
              noMargin
              expand
            >
              <Column noMargin>
                <Text size="section-title">
                  <Trans>Want to know more?</Trans>
                </Text>
              </Column>
              <LineStackLayout noMargin>
                {!isMobile && (
                  <FlatButton
                    onClick={() => {
                      Window.openExternalURL(
                        'https://github.com/GDevelopApp/GDevelop-examples/issues/new/choose'
                      );
                    }}
                    primary
                    leftIcon={<Upload />}
                    label={
                      isMediumScreen ? (
                        <Trans>Submit an example</Trans>
                      ) : (
                        <Trans>Submit your project as an example</Trans>
                      )
                    }
                  />
                )}
                {!isMobile && (
                  <FlatButton
                    onClick={() => {
                      Window.openExternalURL(
                        'https://airtable.com/shrv295oHlsuS69el'
                      );
                    }}
                    primary
                    leftIcon={<TranslateIcon />}
                    label={
                      isMediumScreen ? (
                        <Trans>Submit a tutorial</Trans>
                      ) : (
                        <Trans>
                          Submit a tutorial translated in your language
                        </Trans>
                      )
                    }
                  />
                )}
              </LineStackLayout>
            </LineStackLayout>
          </SectionRow>
          <SectionRow>
            <ColumnStackLayout noMargin expand>
              <Line noMargin>
                <GridList
                  cols={numberOfColumns}
                  style={styles.grid}
                  cellHeight="auto"
                  spacing={ITEMS_SPACING * 2}
                >
                  <GridListTile cols={1} style={{ background: 'transparent' }}>
                    <Paper
                      background="light"
                      style={{ display: 'flex', height: '100%' }}
                    >
                      <Column expand>
                        <Line expand alignItems="flex-start">
                          <Help />
                          <ColumnStackLayout expand alignItems="flex-start">
                            <Text noMargin size="block-title" align="left">
                              <Trans>Blocked on GDevelop?</Trans>
                            </Text>
                            <RaisedButton
                              size="large"
                              color="success"
                              label={<Trans>Ask the AI</Trans>}
                              rightIcon={<ArrowRight />}
                              onClick={() =>
                                onOpenAskAi({
                                  mode: 'chat',
                                  aiRequestId: null,
                                  paneIdentifier: 'center',
                                })
                              }
                            />
                          </ColumnStackLayout>
                        </Line>
                      </Column>
                    </Paper>
                  </GridListTile>
                  {helpItems.map((helpItem, index) => (
                    <GridListTile key={index}>
                      <CardWidget
                        onClick={helpItem.action}
                        key={index}
                        size="large"
                        disabled={helpItem.disabled}
                        useDefaultDisabledStyle
                      >
                        <div style={styles.helpItem}>
                          <ColumnStackLayout
                            expand
                            justifyContent="center"
                            useFullHeight
                          >
                            <Text noMargin size="block-title">
                              {helpItem.title}
                            </Text>
                            <Text noMargin size="body" color="secondary">
                              {helpItem.description}
                            </Text>
                          </ColumnStackLayout>
                        </div>
                      </CardWidget>
                    </GridListTile>
                  ))}
                </GridList>
              </Line>
            </ColumnStackLayout>
          </SectionRow>
          {selectedTutorial && (
            <PrivateTutorialViewDialog
              tutorial={selectedTutorial}
              onClose={() => setSelectedTutorial(null)}
            />
          )}
        </SectionContainer>
      )}

}
