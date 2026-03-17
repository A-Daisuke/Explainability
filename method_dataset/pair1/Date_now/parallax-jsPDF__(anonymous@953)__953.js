function __method_wrapper__() {
                pdfManager.getPage(pageIndex).then(function(page) {
                  var task = new WorkerTask(
                    "RenderPageRequest: page " + pageIndex
                  );
                  startWorkerTask(task);
                  var start =
                    verbosity >= _util.VerbosityLevel.INFOS ? Date.now() : 0;
                  page
                    .getOperatorList({
                      handler: handler,
                      task: task,
                      intent: data.intent,
                      renderInteractiveForms: data.renderInteractiveForms
                    })
                    .then(
                      function(operatorList) {
                        finishWorkerTask(task);

                        if (start) {
                          (0, _util.info)(
                            "page=".concat(
                              pageIndex + 1,
                              " - getOperatorList: time="
                            ) +
                              ""
                                .concat(Date.now() - start, "ms, len=")
                                .concat(operatorList.totalLength)
                          );
                        }
                      },
                      function(e) {
                        finishWorkerTask(task);

                        if (task.terminated) {
                          return;
                        }

                        handler.send("UnsupportedFeature", {
                          featureId: _util.UNSUPPORTED_FEATURES.unknown
                        });
                        var minimumStackMessage =
                          "worker.js: while trying to getPage() and getOperatorList()";
                        var wrappedException;

                        if (typeof e === "string") {
                          wrappedException = {
                            message: e,
                            stack: minimumStackMessage
                          };
                        } else if (_typeof(e) === "object") {
                          wrappedException = {
                            message: e.message || e.toString(),
                            stack: e.stack || minimumStackMessage
                          };
                        } else {
                          wrappedException = {
                            message: "Unknown exception type: " + _typeof(e),
                            stack: minimumStackMessage
                          };
                        }

                        handler.send("PageError", {
                          pageIndex: pageIndex,
                          error: wrappedException,
                          intent: data.intent
                        });
                      }
                    );
                });

}
