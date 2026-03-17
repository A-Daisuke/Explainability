function __method_wrapper__() {
              reset: function reset(skipTempReset) {
                this.prev = 0;
                this.next = 0;
                this.sent = this._sent = undefined;
                this.done = false;
                this.delegate = null;
                this.method = "next";
                this.arg = undefined;
                this.tryEntries.forEach(resetTryEntry);

                if (!skipTempReset) {
                  for (var name in this) {
                    if (
                      name.charAt(0) === "t" &&
                      hasOwn.call(this, name) &&
                      !isNaN(+name.slice(1))
                    ) {
                      this[name] = undefined;
                    }
                  }
                }
              },

}
