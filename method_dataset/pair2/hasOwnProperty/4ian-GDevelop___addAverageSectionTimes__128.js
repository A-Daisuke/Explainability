function __method_wrapper__() {
    static _addAverageSectionTimes(
      section: FrameMeasure,
      destinationSection: FrameMeasure,
      totalCount: integer,
      i: integer
    ): void {
      destinationSection.time =
        (destinationSection.time || 0) + section.time / totalCount;
      for (const sectionName in section.subsections) {
        if (section.subsections.hasOwnProperty(sectionName)) {
          const destinationSubsections = destinationSection.subsections;
          const destinationSubsection = (destinationSubsections[sectionName] =
            destinationSubsections[sectionName] || {
              parent: destinationSection,
              time: 0,
              subsections: {},
            });
          Profiler._addAverageSectionTimes(
            section.subsections[sectionName],
            destinationSubsection,
            totalCount,
            i
          );
        }
      }
    }

}
