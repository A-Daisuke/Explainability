function __method_wrapper__() {
    update(elapsedTime: float, minimumFPS: integer): void {
      if (this._firstUpdateDone) {
        this._firstFrame = false;
      }
      this._firstUpdateDone = true;

      //Compute the elapsed time since last frame
      this._elapsedTime = Math.min(elapsedTime, 1000 / minimumFPS);
      this._elapsedTime *= this._timeScale;

      //Update timers and others members
      for (const name in this._timers.items) {
        if (this._timers.items.hasOwnProperty(name)) {
          this._timers.items[name].updateTime(this._elapsedTime);
        }
      }
      this._timeFromStart += this._elapsedTime;
    }

}
