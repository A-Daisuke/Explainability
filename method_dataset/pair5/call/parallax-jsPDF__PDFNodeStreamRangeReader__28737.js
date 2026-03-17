            function PDFNodeStreamRangeReader(stream, start, end) {
              var _this4;

              _classCallCheck(this, PDFNodeStreamRangeReader);

              _this4 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(PDFNodeStreamRangeReader).call(this, stream)
              );
              _this4._httpHeaders = {};

              for (var property in stream.httpHeaders) {
                var value = stream.httpHeaders[property];

                if (typeof value === "undefined") {
                  continue;
                }

                _this4._httpHeaders[property] = value;
              }

              _this4._httpHeaders["Range"] = "bytes="
                .concat(start, "-")
                .concat(end - 1);

              var handleResponse = function handleResponse(response) {
                if (response.statusCode === 404) {
                  var error = new _util.MissingPDFException(
                    'Missing PDF "'.concat(_this4._url, '".')
                  );
                  _this4._storedError = error;
                  return;
                }

                _this4._setReadableStream(response);
              };

              _this4._request = null;

              if (_this4._url.protocol === "http:") {
                _this4._request = http.request(
                  createRequestOptions(_this4._url, _this4._httpHeaders),
                  handleResponse
                );
              } else {
                _this4._request = https.request(
                  createRequestOptions(_this4._url, _this4._httpHeaders),
                  handleResponse
                );
              }

              _this4._request.on("error", function(reason) {
                _this4._storedError = reason;
              });

              _this4._request.end();

              return _this4;
            }
