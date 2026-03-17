            function NetworkPdfManager(
              docId,
              pdfNetworkStream,
              args,
              evaluatorOptions,
              docBaseUrl
            ) {
              var _this2;

              _classCallCheck(this, NetworkPdfManager);

              _this2 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(NetworkPdfManager).call(this)
              );
              _this2._docId = docId;
              _this2._password = args.password;
              _this2._docBaseUrl = docBaseUrl;
              _this2.msgHandler = args.msgHandler;
              _this2.evaluatorOptions = evaluatorOptions;
              _this2.streamManager = new _chunked_stream.ChunkedStreamManager(
                pdfNetworkStream,
                {
                  msgHandler: args.msgHandler,
                  length: args.length,
                  disableAutoFetch: args.disableAutoFetch,
                  rangeChunkSize: args.rangeChunkSize
                }
              );
              _this2.pdfDocument = new _document.PDFDocument(
                _assertThisInitialized(_this2),
                _this2.streamManager.getStream()
              );
              return _this2;
            }
