            function PDFNodeStreamFsRangeReader(stream, start, end) {
              var _this6;

              _classCallCheck(this, PDFNodeStreamFsRangeReader);

              _this6 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(PDFNodeStreamFsRangeReader).call(this, stream)
              );
              var path = decodeURIComponent(_this6._url.path);

              if (fileUriRegex.test(_this6._url.href)) {
                path = path.replace(/^\//, "");
              }

              _this6._setReadableStream(
                fs.createReadStream(path, {
                  start: start,
                  end: end - 1
                })
              );

              return _this6;
            }
