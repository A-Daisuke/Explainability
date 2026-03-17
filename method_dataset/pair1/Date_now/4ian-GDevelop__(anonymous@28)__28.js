function __method_wrapper__() {
    ({ featureId }: {| featureId: Feature |}): boolean => {
      const programOpeningCount = getProgramOpeningCount();
      const settings = featuresDisplaySettings[featureId];
      if (!settings) return false;

      const { count, intervalInDays, minimumProgramOpeningCount } = settings;

      const acknowledgments = newFeaturesAcknowledgements[featureId];
      if (!acknowledgments)
        return programOpeningCount > minimumProgramOpeningCount;

      const { dates } = acknowledgments;
      if (dates.length >= count) return false;

      const lastDate = dates[dates.length - 1];

      return (
        programOpeningCount > minimumProgramOpeningCount &&
        Date.now() > lastDate + intervalInDays * ONE_DAY
      );
    },

}
