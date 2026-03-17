export const getRecentPersistedState = () => {
  try {
    const serializedState = localStorage.getItem(localStoreUserSurveyKey);
    if (!serializedState) return null;
    const state = JSON.parse(serializedState);
    if (
      !state.lastModifiedAt ||
      Date.now() - state.lastModifiedAt > TEN_MINUTES
    ) {
      // After a delay, the user will have forgotten what they were doing
      // or the previous questions.
      return null;
    }
    return state;
  } catch (error) {
    console.log('An error occurred when reading local storage:', error);
    return null;
  }
};
