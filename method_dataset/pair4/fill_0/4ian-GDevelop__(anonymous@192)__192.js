function __method_wrapper__() {
    it('should increment time elapsed frame when animation is playing', () => {
      const runtimeGame = gdjs.getPixiRuntimeGame();
      const runtimeScene = new gdjs.TestRuntimeScene(runtimeGame);
      const stepDurationInMilliseconds = 1000 / 60;
      runtimeScene._timeManager.getElapsedTime = function () {
        return stepDurationInMilliseconds;
      };

      const object = createObjectWithAnimationInScene(runtimeScene);
      runtimeScene.addObject(object);

      runtimeScene.renderAndStep(stepDurationInMilliseconds);

      expect(object.getAnimationElapsedTime()).to.be(
        stepDurationInMilliseconds / 1000
      );

      const minimumStepCountBeforeNextFrame = Math.ceil(
        firstAnimationTimeBetweenFrames / (stepDurationInMilliseconds / 1000)
      );
      new Array(minimumStepCountBeforeNextFrame).fill(0).forEach(() => {
        runtimeScene.renderAndStep(stepDurationInMilliseconds);
      });

      expect(object.getAnimationFrame()).to.be(1);
    });

}
