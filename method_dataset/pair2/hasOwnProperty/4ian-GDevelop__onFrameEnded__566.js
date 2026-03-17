function __method_wrapper__() {
    onFrameEnded(): void {
      //Only clear the ended touches at the end of the frame.
      for (const id in this._mouseOrTouches.items) {
        if (this._mouseOrTouches.items.hasOwnProperty(id)) {
          const touch = this._mouseOrTouches.items[id];
          if (touch.justEnded) {
            this._mouseOrTouches.remove(id);
          }
        }
      }
      this._startedTouches.length = 0;
      this._endedTouches.length = 0;
      this._releasedKeys.clear();
      this._justPressedKeys.clear();
      this._releasedMouseButtons.length = 0;
      this._mouseWheelDelta = 0;
      this._lastStartedTouchIndex = 0;
      this._lastEndedTouchIndex = 0;
    }

}
