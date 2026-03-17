function __method_wrapper__() {
  shouldUpdate() {
    const now = Date.now();
    const delta = now - this._lastFrameTime;

    // If the user did not interact with the scene for 1 second, go back to idleFps.
    if (now - this._lastInteractionTime > 1000) {
      this._interval = 1000 / this._idleFps;
    }

    if (delta > this._interval || this._forceUpdate) {
      this._lastFrameTime = now - (delta % this._interval);
      this._forceUpdate = false;
      return true;
    }

    return false;
  }

}
