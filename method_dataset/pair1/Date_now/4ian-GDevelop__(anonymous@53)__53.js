function __method_wrapper__() {
    ({ featureId }: {| featureId: Feature |}) => {
      if (!featuresDisplaySettings[featureId]) return;

      const acknowledgments = newFeaturesAcknowledgements[featureId];
      if (!acknowledgments) {
        setNewFeaturesAcknowledgements({
          ...newFeaturesAcknowledgements,
          [featureId]: { dates: [Date.now()] },
        });
        return;
      }
      setNewFeaturesAcknowledgements({
        ...newFeaturesAcknowledgements,
        [featureId]: {
          ...acknowledgments,
          dates: [...acknowledgments.dates, Date.now()],
        },
      });
    },

}
