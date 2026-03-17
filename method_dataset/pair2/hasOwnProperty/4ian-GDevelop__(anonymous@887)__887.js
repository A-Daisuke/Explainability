function __method_wrapper__() {
      () => {
        if (!currentStep) return;
        const { id, isOnClosableDialog } = currentStep;
        // Set expected editor on each step change
        if (id && editorSwitches.hasOwnProperty(id)) {
          setExpectedEditor(editorSwitches[id]);
        }
        // Set fallback step index to the new step index if it is not on a closable dialog.
        if (!isOnClosableDialog) {
          currentStepFallbackStepIndex.current = currentStepIndex;
        }
        // At each step start, reset change watching logics.
        setElementWithValueToWatchIfChanged(null);
        setElementWithValueToWatchIfEquals(null);
        setObjectSceneInstancesToWatch(null);
        setSceneObjectCountToWatch(false);
        setShouldWatchProjectChanges(false);
        // If index out of bounds, display end dialog.
        if (currentStepIndex >= stepCount) {
          setDisplayEndDialog(true);
        }
      },

}
