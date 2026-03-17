class __C__ {
  startPlayInterval() {
    clearInterval(this.playInterval)
    let lastTick = Date.now()
    this.playInterval = setInterval(() => {
      // Update UI
      if (!this.player) return
      const currentTime = this.player.getCurrentTime()
      this.ctx.setCurrentTime(currentTime)

      const exactTimeElapsed = (Date.now() - lastTick) / 1000
      lastTick = Date.now()
      this.listeningTimeSinceSync += exactTimeElapsed
      const TimeToWaitBeforeSync = this.lastSyncTime > 0 ? 10 : 20
      if (this.listeningTimeSinceSync >= TimeToWaitBeforeSync) {
        this.sendProgressSync(currentTime)
      }
    }, 1000)
  }

}
