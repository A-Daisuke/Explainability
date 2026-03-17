export const persistState = (state: {|
  userAnswers: UserAnswers,
  questionId: string,
|}) => {
  try {
    localStorage.setItem(
      localStoreUserSurveyKey,
      JSON.stringify({
        ...state,
        lastModifiedAt: Date.now(),
      })
    );
  } catch (error) {
    console.log(
      'An error occurred when storing user survey in local storage:',
      error
    );
  }
};
