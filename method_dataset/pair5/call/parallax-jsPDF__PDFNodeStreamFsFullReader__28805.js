            function PDFNodeStreamFsFullReader(stream) {
              var _this5;

              _classCallCheck(this, PDFNodeStreamFsFullReader);

              _this5 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(PDFNodeStreamFsFullReader).call(this, stream)
              );
              var path = decodeURIComponent(_this5._url.path);

              if (fileUriRegex.test(_this5._url.href)) {
                path = path.replace(/^\//, "");
              }

              fs.lstat(path, function(error, stat) {
                if (error) {
                  if (error.code === "ENOENT") {
                    error = new _util.MissingPDFException(
                      'Missing PDF "'.concat(path, '".')
                    );
                  }

                  _this5._storedError = error;

                  _this5._headersCapability.reject(error);

                  return;
                }

                _this5._contentLength = stat.size;

                _this5._setReadableStream(fs.createReadStream(path));

                _this5._headersCapability.resolve();
              });
              return _this5;
            }
