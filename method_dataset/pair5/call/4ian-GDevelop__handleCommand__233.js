function __method_wrapper__() {
    protected handleCommand(data: any) {
      const that = this;
      const runtimeGame = this._runtimegame;
      if (!data || !data.command) {
        // Not a command that's meant to be handled by the debugger, return silently to
        // avoid polluting the console.
        return;
      }

      if (data.command === 'play') {
        runtimeGame.pause(false);
      } else if (data.command === 'pause') {
        runtimeGame.pause(true);
        that.sendRuntimeGameDump();
      } else if (data.command === 'refresh') {
        that.sendRuntimeGameDump();
      } else if (data.command === 'set') {
        that.set(data.path, data.newValue);
      } else if (data.command === 'call') {
        that.call(data.path, data.args);
      } else if (data.command === 'profiler.start') {
        runtimeGame.startCurrentSceneProfiler(function (stoppedProfiler) {
          that.sendProfilerOutput(
            stoppedProfiler.getFramesAverageMeasures(),
            stoppedProfiler.getStats()
          );
          that.sendProfilerStopped();
        });
        that.sendProfilerStarted();
      } else if (data.command === 'profiler.stop') {
        runtimeGame.stopCurrentSceneProfiler();
      } else if (data.command === 'hotReload') {
        that._hotReloader.hotReload().then((logs) => {
          that.sendHotReloaderLogs(logs);
        });
      } else {
        logger.info(
          'Unknown command "' + data.command + '" received by the debugger.'
        );
      }
    }

}
