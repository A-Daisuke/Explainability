function __method_wrapper__() {
    startPlayInterval() {
      let lastTick = Date.now()
      clearInterval(this.playInterval)
      this.playInterval = setInterval(() => {
        if (!this.localAudioPlayer) return

        const currentTime = this.localAudioPlayer.getCurrentTime()
        this.setCurrentTime(currentTime)
        const exactTimeElapsed = (Date.now() - lastTick) / 1000
        lastTick = Date.now()
        this.listeningTimeSinceSync += exactTimeElapsed
        if (this.listeningTimeSinceSync >= 30) {
          this.listeningTimeSinceSync = 0
          this.sendProgressSync(currentTime)
        }
      }, 1000)
    },

}
