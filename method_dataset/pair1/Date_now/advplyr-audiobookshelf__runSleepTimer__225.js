class __C__ {
    runSleepTimer(time) {
      this.sleepTimerRemaining = time.seconds

      var lastTick = Date.now()
      clearInterval(this.sleepTimer)
      this.sleepTimer = setInterval(() => {
        var elapsed = Date.now() - lastTick
        lastTick = Date.now()
        this.sleepTimerRemaining -= elapsed / 1000

        if (this.sleepTimerRemaining <= 0) {
          this.sleepTimerEnd()
        }
      }, 1000)
    },

}
