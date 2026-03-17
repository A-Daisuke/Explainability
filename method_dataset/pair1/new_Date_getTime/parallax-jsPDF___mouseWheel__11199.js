function __method_wrapper__() {
              value: function _mouseWheel(evt) {
                if (!this.active) {
                  return;
                }

                evt.preventDefault();
                var delta = (0, _ui_utils.normalizeWheelEventDelta)(evt);
                var currentTime = new Date().getTime();
                var storedTime = this.mouseScrollTimeStamp;

                if (
                  currentTime > storedTime &&
                  currentTime - storedTime < MOUSE_SCROLL_COOLDOWN_TIME
                ) {
                  return;
                }

                if (
                  (this.mouseScrollDelta > 0 && delta < 0) ||
                  (this.mouseScrollDelta < 0 && delta > 0)
                ) {
                  this._resetMouseScrollState();
                }

                this.mouseScrollDelta += delta;

                if (Math.abs(this.mouseScrollDelta) >= PAGE_SWITCH_THRESHOLD) {
                  var totalDelta = this.mouseScrollDelta;

                  this._resetMouseScrollState();

                  var success =
                    totalDelta > 0
                      ? this._goToPreviousPage()
                      : this._goToNextPage();

                  if (success) {
                    this.mouseScrollTimeStamp = currentTime;
                  }
                }
              }

}
