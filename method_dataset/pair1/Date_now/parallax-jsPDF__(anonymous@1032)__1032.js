function __method_wrapper__() {
              pdfManager.getPage(pageIndex).then(function(page) {
                var task = new WorkerTask("GetTextContent: page " + pageIndex);
                startWorkerTask(task);
                var start =
                  verbosity >= _util.VerbosityLevel.INFOS ? Date.now() : 0;
                page
                  .extractTextContent({
                    handler: handler,
                    task: task,
                    sink: sink,
                    normalizeWhitespace: data.normalizeWhitespace,
                    combineTextItems: data.combineTextItems
                  })
                  .then(
                    function() {
                      finishWorkerTask(task);

                      if (start) {
                        (0, _util.info)(
                          "page=".concat(
                            pageIndex + 1,
                            " - getTextContent: time="
                          ) + "".concat(Date.now() - start, "ms")
                        );
                      }

                      sink.close();
                    },
                    function(reason) {
                      finishWorkerTask(task);

                      if (task.terminated) {
                        return;
                      }

                      sink.error(reason);
                      throw reason;
                    }
                  );
              });

}
