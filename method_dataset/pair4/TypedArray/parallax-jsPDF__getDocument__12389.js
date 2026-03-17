        function getDocument(src) {
          var task = new PDFDocumentLoadingTask();
          var source;

          if (typeof src === "string") {
            source = {
              url: src
            };
          } else if ((0, _util.isArrayBuffer)(src)) {
            source = {
              data: src
            };
          } else if (src instanceof PDFDataRangeTransport) {
            source = {
              range: src
            };
          } else {
            if (_typeof(src) !== "object") {
              throw new Error(
                "Invalid parameter in getDocument, " +
                  "need either Uint8Array, string or a parameter object"
              );
            }

            if (!src.url && !src.data && !src.range) {
              throw new Error(
                "Invalid parameter object: need either .data, .range or .url"
              );
            }

            source = src;
          }

          var params = Object.create(null);
          var rangeTransport = null,
            worker = null;

          for (var key in source) {
            if (key === "url" && typeof window !== "undefined") {
              params[key] = new _util.URL(source[key], window.location).href;
              continue;
            } else if (key === "range") {
              rangeTransport = source[key];
              continue;
            } else if (key === "worker") {
              worker = source[key];
              continue;
            } else if (key === "data" && !(source[key] instanceof Uint8Array)) {
              var pdfBytes = source[key];

              if (typeof pdfBytes === "string") {
                params[key] = (0, _util.stringToBytes)(pdfBytes);
              } else if (
                _typeof(pdfBytes) === "object" &&
                pdfBytes !== null &&
                !isNaN(pdfBytes.length)
              ) {
                params[key] = new Uint8Array(pdfBytes);
              } else if ((0, _util.isArrayBuffer)(pdfBytes)) {
                params[key] = new Uint8Array(pdfBytes);
              } else {
                throw new Error(
                  "Invalid PDF binary data: either typed array, " +
                    "string or array-like object is expected in the " +
                    "data property."
                );
              }

              continue;
            }

            params[key] = source[key];
          }

          params.rangeChunkSize =
            params.rangeChunkSize || DEFAULT_RANGE_CHUNK_SIZE;
          params.CMapReaderFactory =
            params.CMapReaderFactory || _display_utils.DOMCMapReaderFactory;
          params.ignoreErrors = params.stopAtErrors !== true;
          params.pdfBug = params.pdfBug === true;
          var NativeImageDecoderValues = Object.values(
            _util.NativeImageDecoding
          );

          if (
            params.nativeImageDecoderSupport === undefined ||
            !NativeImageDecoderValues.includes(params.nativeImageDecoderSupport)
          ) {
            params.nativeImageDecoderSupport =
              _api_compatibility.apiCompatibilityParams
                .nativeImageDecoderSupport || _util.NativeImageDecoding.DECODE;
          }

          if (!Number.isInteger(params.maxImageSize)) {
            params.maxImageSize = -1;
          }

          if (typeof params.isEvalSupported !== "boolean") {
            params.isEvalSupported = true;
          }

          if (typeof params.disableFontFace !== "boolean") {
            params.disableFontFace =
              _api_compatibility.apiCompatibilityParams.disableFontFace ||
              false;
          }

          if (typeof params.disableRange !== "boolean") {
            params.disableRange = false;
          }

          if (typeof params.disableStream !== "boolean") {
            params.disableStream = false;
          }

          if (typeof params.disableAutoFetch !== "boolean") {
            params.disableAutoFetch = false;
          }

          if (typeof params.disableCreateObjectURL !== "boolean") {
            params.disableCreateObjectURL =
              _api_compatibility.apiCompatibilityParams
                .disableCreateObjectURL || false;
          }

          (0, _util.setVerbosityLevel)(params.verbosity);

          if (!worker) {
            var workerParams = {
              postMessageTransfers: params.postMessageTransfers,
              verbosity: params.verbosity,
              port: _worker_options.GlobalWorkerOptions.workerPort
            };
            worker = workerParams.port
              ? PDFWorker.fromPort(workerParams)
              : new PDFWorker(workerParams);
            task._worker = worker;
          }

          var docId = task.docId;
          worker.promise
            .then(function() {
              if (task.destroyed) {
                throw new Error("Loading aborted");
              }

              return _fetchDocument(worker, params, rangeTransport, docId).then(
                function(workerId) {
                  if (task.destroyed) {
                    throw new Error("Loading aborted");
                  }

                  var networkStream;

                  if (rangeTransport) {
                    networkStream = new _transport_stream.PDFDataTransportStream(
                      {
                        length: params.length,
                        initialData: params.initialData,
                        disableRange: params.disableRange,
                        disableStream: params.disableStream
                      },
                      rangeTransport
                    );
                  } else if (!params.data) {
                    networkStream = createPDFNetworkStream({
                      url: params.url,
                      length: params.length,
                      httpHeaders: params.httpHeaders,
                      withCredentials: params.withCredentials,
                      rangeChunkSize: params.rangeChunkSize,
                      disableRange: params.disableRange,
                      disableStream: params.disableStream
                    });
                  }

                  var messageHandler = new _message_handler.MessageHandler(
                    docId,
                    workerId,
                    worker.port
                  );
                  messageHandler.postMessageTransfers =
                    worker.postMessageTransfers;
                  var transport = new WorkerTransport(
                    messageHandler,
                    task,
                    networkStream,
                    params
                  );
                  task._transport = transport;
                  messageHandler.send("Ready", null);
                }
              );
            })
            .catch(task._capability.reject);
          return task;
        }
