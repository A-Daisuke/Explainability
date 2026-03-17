function __method_wrapper__() {
  .add('BuildStepsProgress (build) (errored)', () => (
    <BuildStepsProgress
      exportStep={'build'}
      build={{
        id: 'fake-build-id',
        gameId: 'game-id',
        userId: 'fake-user-id',
        type: 'cordova-build',
        status: 'error',
        logsKey: '/fake-error.log',
        updatedAt: Date.now(),
        createdAt: Date.now(),
      }}
      stepMaxProgress={100}
      stepCurrentProgress={20}
      errored
      hasBuildStep
    />
  ))

}
