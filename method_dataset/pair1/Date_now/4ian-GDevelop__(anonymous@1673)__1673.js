function __method_wrapper__() {
  .add('BuildStepsProgress (build) (complete)', () => (
    <BuildStepsProgress
      exportStep={'done'}
      build={{
        id: 'fake-build-id',
        gameId: 'game-id',
        userId: 'fake-user-id',
        type: 'cordova-build',
        status: 'complete',
        logsKey: '/fake-error.log',
        apkKey: '/fake-game.apk',
        updatedAt: Date.now(),
        createdAt: Date.now(),
      }}
      stepMaxProgress={100}
      stepCurrentProgress={20}
      errored={false}
      hasBuildStep
    />
  ))

}
