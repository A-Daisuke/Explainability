function __method_wrapper__() {
    () => {
      const courseChapters = course ? getCourseChapters(course.id) : null;
      if (!course || !courseChapters) {
        return new Array(numberOfTilesToDisplay).fill(0).map((_, index) => {
          return (
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
                <Skeleton height={40} />
                <Skeleton height={20} />
                <Skeleton height={60} />
                <LargeSpacer />
              </Column>
            </React.Fragment>
          );
        });
      }
      const completionByChapter = new Array(course.chaptersTargetCount)
        .fill(0)
        .map((_, index) => {
          const chapter = courseChapters[index];
          if (!chapter) return false;
          const chapterCompletion = getCourseChapterCompletion(
            course.id,
            chapter.id
          );
          if (!chapterCompletion) return false;
          return chapterCompletion.completedTasks >= chapterCompletion.tasks;
        });
      let lastCompletedChapterIndex = -1;
      // Find last chapter completed among the first completed chapters.
      // For instance, if completion looks like:
      // 1 2 3 4 5 6 7 8 9
      // ✓ ✓ ✓ ✓ ✗ ✓ ✗ ✗ ✗
      // We want to display the chapters starting from chapter 4.
      for (const chapterCompletion of completionByChapter) {
        if (chapterCompletion) lastCompletedChapterIndex++;
        else break;
      }
      const startChapterIndex = Math.max(
        // If no completed chapter, make sure the first chapter is displayed.
        0,
        Math.min(
          // If the course is near its end, make sure the X last chapters are displayed.
          course.chaptersTargetCount - numberOfTilesToDisplay,
          lastCompletedChapterIndex
        )
      );

      return new Array(numberOfTilesToDisplay).fill(0).map((_, index) => {
        const chapterIndex = startChapterIndex + index;
        if (chapterIndex >= course.chaptersTargetCount) return null;

        const chapter = courseChapters[chapterIndex];
        return (
          <React.Fragment key={`chapter-${chapterIndex}`}>
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
            <ChapterTile
              course={course}
              chapter={chapter}
              chapterIndex={chapterIndex}
              gdevelopTheme={gdevelopTheme}
              isComplete={completionByChapter[chapterIndex]}
            />
          </React.Fragment>
        );
      });
    },

}
