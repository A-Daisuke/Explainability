function __method_wrapper__() {
              dispatchException: function dispatchException(exception) {
                if (this.done) {
                  throw exception;
                }

                var context = this;

                function handle(loc, caught) {
                  record.type = "throw";
                  record.arg = exception;
                  context.next = loc;

                  if (caught) {
                    context.method = "next";
                    context.arg = undefined;
                  }

                  return !!caught;
                }

                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                  var entry = this.tryEntries[i];
                  var record = entry.completion;

                  if (entry.tryLoc === "root") {
                    return handle("end");
                  }

                  if (entry.tryLoc <= this.prev) {
                    var hasCatch = hasOwn.call(entry, "catchLoc");
                    var hasFinally = hasOwn.call(entry, "finallyLoc");

                    if (hasCatch && hasFinally) {
                      if (this.prev < entry.catchLoc) {
                        return handle(entry.catchLoc, true);
                      } else if (this.prev < entry.finallyLoc) {
                        return handle(entry.finallyLoc);
                      }
                    } else if (hasCatch) {
                      if (this.prev < entry.catchLoc) {
                        return handle(entry.catchLoc, true);
                      }
                    } else if (hasFinally) {
                      if (this.prev < entry.finallyLoc) {
                        return handle(entry.finallyLoc);
                      }
                    } else {
                      throw new Error("try statement without catch or finally");
                    }
                  }
                }
              },

}
