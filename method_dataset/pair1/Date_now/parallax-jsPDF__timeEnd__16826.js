function __method_wrapper__() {
                value: function timeEnd(name) {
                  if (!this.enabled) {
                    return;
                  }

                  if (!(name in this.started)) {
                    (0, _util.warn)("Timer has not been started for " + name);
                  }

                  this.times.push({
                    name: name,
                    start: this.started[name],
                    end: Date.now()
                  });
                  delete this.started[name];
                }

}
