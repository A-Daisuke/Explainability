function __method_wrapper__() {
    () => {
      const unsavedChangesAmount = getUnsavedChangesAmount(unsavedChanges);

      if (
        !displaySaveReminderPreference.activated ||
        isInQuickCustomization ||
        currentlyRunningInAppTutorial ||
        !project
      ) {
        setDisplayReminder(false);
        return;
      }
      const now = Date.now();
      const newDisplayReminder =
        unsavedChangesAmount === 'risky' &&
        (!lastAcknowledgement ||
          now - lastAcknowledgement > DURATION_BETWEEN_TWO_DISPLAYS);
      if (newDisplayReminder !== displayReminder) {
        setDisplayReminder(newDisplayReminder);
      }
    },

}
