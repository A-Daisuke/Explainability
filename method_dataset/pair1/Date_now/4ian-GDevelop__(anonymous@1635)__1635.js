function __method_wrapper__() {
  .add('BuildStepsProgress (build)', () => (
    <BuildStepsProgress
      exportStep={'build'}
      build={{
        id: 'fake-build-id',
        gameId: 'game-id',
        userId: 'fake-user-id',
        type: 'electron-build',
        status: 'pending',
        updatedAt: Date.now(),
        createdAt: Date.now(),
      }}
      stepMaxProgress={100}
      stepCurrentProgress={20}
      errored={false}
      showSeeAllMyBuildsExplanation
      hasBuildStep
    />
  ))

}
