function __method_wrapper__() {
      () => {
        changeStep(startStepIndex);
        for (let index = startStepIndex; index >= 0; index--) {
          if (!tutorial.flow[index].isOnClosableDialog) {
            currentStepFallbackStepIndex.current = index;
            break;
          }
        }
        // Find the last editor switch to set the expected editor and scene.
        let newExpectedEditor = { editor: 'Home' };
        for (let index = startStepIndex; index >= 0; index--) {
          if (
            tutorial.flow[index].id &&
            tutorial.editorSwitches.hasOwnProperty(tutorial.flow[index].id)
          ) {
            newExpectedEditor =
              tutorial.editorSwitches[tutorial.flow[index].id];
            break;
          }
        }
        setExpectedEditor(newExpectedEditor);
      },

}
