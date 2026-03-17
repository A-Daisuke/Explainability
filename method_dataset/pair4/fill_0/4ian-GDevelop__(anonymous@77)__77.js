function __method_wrapper__() {
      {({ i18n }) => (
        <SectionContainer
          title={<Trans>Official Game Dev courses</Trans>}
          backAction={onBack}
        >
          <SectionRow>
            <CoursePreviewBanner
              course={previewedCourse}
              getCourseChapters={getCourseChapters}
              getCourseCompletion={getCourseCompletion}
              getCourseChapterCompletion={getCourseChapterCompletion}
              onDisplayCourse={() => {
                if (!previewedCourse || !listedCourses) return;
                const courseListingData = listedCourses.find(
                  listedCourse => listedCourse.id === previewedCourse.id
                );
                if (!courseListingData) return;
                onSelectCourse(courseListingData);
              }}
            />
          </SectionRow>
          <SectionRow>
            <Line>
              <GridList
                cols={numberOfItemsOnOneRow}
                style={styles.grid}
                cellHeight="auto"
                spacing={ITEMS_SPACING * 2}
              >
                {courses && listedCourses
                  ? courses.slice(0, numberOfItemsOnOneRow).map(course => {
                      const completion = getCourseCompletion(course.id);
                      const courseListingData = listedCourses.find(
                        listedCourse => listedCourse.id === course.id
                      );
                      return (
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
                      );
                    })
                  : new Array(6).fill(0).map((_, index) => (
                      <GridListTile key={`skeleton-course-${index}`}>
                        <CourseCard
                          course={null}
                          courseListingData={null}
                          completion={null}
                        />
                      </GridListTile>
                    ))}
              </GridList>
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
          {courses && listedCourses && courses.length > numberOfItemsOnOneRow && (
            <SectionRow>
              <Line>
                <GridList
                  cols={numberOfItemsOnOneRow}
                  style={styles.grid}
                  cellHeight="auto"
                  spacing={ITEMS_SPACING * 2}
                >
                  {courses
                    .slice(numberOfItemsOnOneRow, 2 * numberOfItemsOnOneRow)
                    .map(course => {
                      const completion = getCourseCompletion(course.id);
                      const courseListingData = listedCourses.find(
                        listedCourse => listedCourse.id === course.id
                      );
                      return (
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
                      );
                    })}
                </GridList>
              </Line>
            </SectionRow>
          )}
          {!hidePremiumProducts && (
            <SectionRow>
              <BundlePreviewBanner
                onDisplayBundle={onSelectBundle}
                category="premium"
                i18n={i18n}
              />
            </SectionRow>
          )}
          {courses &&
            listedCourses &&
            courses.length > 2 * numberOfItemsOnOneRow && (
              <SectionRow>
                <Line>
                  <GridList
                    cols={numberOfItemsOnOneRow}
                    style={styles.grid}
                    cellHeight="auto"
                    spacing={ITEMS_SPACING * 2}
                  >
                    {courses.slice(2 * numberOfItemsOnOneRow).map(course => {
                      const completion = getCourseCompletion(course.id);
                      const courseListingData = listedCourses.find(
                        listedCourse => listedCourse.id === course.id
                      );
                      return (
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
                      );
                    })}
                  </GridList>
                </Line>
              </SectionRow>
            )}
        </SectionContainer>
      )}

}
