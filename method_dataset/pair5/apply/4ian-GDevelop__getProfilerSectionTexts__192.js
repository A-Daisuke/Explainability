function __method_wrapper__() {
    static getProfilerSectionTexts(
      sectionName: string,
      profilerSection: any,
      outputs: any
    ): void {
      const percent =
        profilerSection.parent && profilerSection.parent.time !== 0
          ? (
              (profilerSection.time / profilerSection.parent.time) *
              100
            ).toFixed(1)
          : '100%';
      const time = profilerSection.time.toFixed(2);
      outputs.push(sectionName + ': ' + time + 'ms (' + percent + ')');
      const subsectionsOutputs = [];
      for (const subsectionName in profilerSection.subsections) {
        if (profilerSection.subsections.hasOwnProperty(subsectionName)) {
          Profiler.getProfilerSectionTexts(
            subsectionName,
            profilerSection.subsections[subsectionName],
            subsectionsOutputs
          );
        }
      }
      outputs.push.apply(outputs, subsectionsOutputs);
    }

}
