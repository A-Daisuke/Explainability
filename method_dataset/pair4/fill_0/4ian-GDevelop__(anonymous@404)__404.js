function __method_wrapper__() {
    () => {
      if (isMobile && !isLandscape) {
        return null; // Don't display course tiles on mobile, they take too much space.
      }
      if (!productListingDatasIncludedInBundle) {
        return new Array(numberOfTilesToDisplay).fill(0).map((_, index) => (
          <React.Fragment key={`skeleton-${index}`}>
            {index > 0 &&
              (isMobile && !isLandscape ? (
                <Column noMargin>
                  <Divider orientation="horizontal" />
                </Column>
              ) : (
                <Line noMargin>
                  <Divider orientation="vertical" />
                </Line>
              ))}
            {index > 0 && <Spacer />}
            <Column expand>
              <Skeleton height={140} />
              <Skeleton height={20} />
              <Skeleton height={20} />
              <LargeSpacer />
            </Column>
          </React.Fragment>
        ));
      }

      const coursesIncludedInBundle = productListingDatasIncludedInBundle.filter(
        productListingData => productListingData.productType === 'COURSE'
      );

      return new Array(numberOfTilesToDisplay).fill(0).map((_, index) => {
        const courseListingData: ?CourseListingData =
          // $FlowFixMe
          coursesIncludedInBundle[index];
        if (!courseListingData) {
          return <div style={{ flex: 1 }} key={`empty-tile-${index}`} />;
        }

        return (
          <React.Fragment key={`course-${courseListingData.id}`}>
            {index > 0 && (
              <Line noMargin>
                <Divider orientation="vertical" />
              </Line>
            )}
            {index > 0 && <Spacer />}
            <CourseTile
              courseListingData={courseListingData}
              isAlreadyReceived={isAlreadyReceived}
            />
          </React.Fragment>
        );
      });
    },

}
