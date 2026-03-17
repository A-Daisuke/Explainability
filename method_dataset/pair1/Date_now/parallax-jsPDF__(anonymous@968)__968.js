function __method_wrapper__() {
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

}
