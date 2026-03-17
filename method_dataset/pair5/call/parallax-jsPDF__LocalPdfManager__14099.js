            function LocalPdfManager(
              docId,
              data,
              password,
              evaluatorOptions,
              docBaseUrl
            ) {
              var _this;

              _classCallCheck(this, LocalPdfManager);

              _this = _possibleConstructorReturn(
                this,
                _getPrototypeOf(LocalPdfManager).call(this)
              );
              _this._docId = docId;
              _this._password = password;
              _this._docBaseUrl = docBaseUrl;
              _this.evaluatorOptions = evaluatorOptions;
              var stream = new _stream.Stream(data);
              _this.pdfDocument = new _document.PDFDocument(
                _assertThisInitialized(_this),
                stream
              );
              _this._loadedStreamPromise = Promise.resolve(stream);
              return _this;
            }
