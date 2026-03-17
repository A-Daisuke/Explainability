            function PDFNodeStreamFullReader(stream) {
              var _this3;

              _classCallCheck(this, PDFNodeStreamFullReader);

              _this3 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(PDFNodeStreamFullReader).call(this, stream)
              );

              var handleResponse = function handleResponse(response) {
                if (response.statusCode === 404) {
                  var error = new _util.MissingPDFException(
                    'Missing PDF "'.concat(_this3._url, '".')
                  );
                  _this3._storedError = error;

                  _this3._headersCapability.reject(error);

                  return;
                }

                _this3._headersCapability.resolve();

                _this3._setReadableStream(response);

                var getResponseHeader = function getResponseHeader(name) {
                  return _this3._readableStream.headers[name.toLowerCase()];
                };

                var _validateRangeRequest = (0,
                  _network_utils.validateRangeRequestCapabilities)({
                    getResponseHeader: getResponseHeader,
                    isHttp: stream.isHttp,
                    rangeChunkSize: _this3._rangeChunkSize,
                    disableRange: _this3._disableRange
                  }),
                  allowRangeRequests = _validateRangeRequest.allowRangeRequests,
                  suggestedLength = _validateRangeRequest.suggestedLength;

                _this3._isRangeSupported = allowRangeRequests;
                _this3._contentLength =
                  suggestedLength || _this3._contentLength;
                _this3._filename = (0,
                _network_utils.extractFilenameFromHeader)(getResponseHeader);
              };

              _this3._request = null;

              if (_this3._url.protocol === "http:") {
                _this3._request = http.request(
                  createRequestOptions(_this3._url, stream.httpHeaders),
                  handleResponse
                );
              } else {
                _this3._request = https.request(
                  createRequestOptions(_this3._url, stream.httpHeaders),
                  handleResponse
                );
              }

              _this3._request.on("error", function(reason) {
                _this3._storedError = reason;

                _this3._headersCapability.reject(reason);
              });

              _this3._request.end();

              return _this3;
            }
