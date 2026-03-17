class __C__ {
    handleGesture() {
      // Touch must be less than 1s. Must be > 60px drag and X distance > Y distance
      const touchTimeMs = Date.now() - this.touchstartTime
      if (touchTimeMs >= 1000) {
        console.log('Touch too long', touchTimeMs)
        return
      }

      const touchDistanceX = Math.abs(this.touchendX - this.touchstartX)
      const touchDistanceY = Math.abs(this.touchendY - this.touchstartY)
      const touchDistance = Math.sqrt(Math.pow(this.touchstartX - this.touchendX, 2) + Math.pow(this.touchstartY - this.touchendY, 2))
      if (touchDistance < 60) {
        return
      }

      if (touchDistanceX < 60 || touchDistanceY > touchDistanceX) {
        return
      }

      if (this.touchendX < this.touchstartX) {
        this.next()
      }
      if (this.touchendX > this.touchstartX) {
        this.prev()
      }
    },

}
