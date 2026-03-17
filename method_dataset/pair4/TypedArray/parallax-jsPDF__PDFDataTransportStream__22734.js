          function PDFDataTransportStream(params, pdfDataRangeTransport) {
            var _this = this;

            (0, _util.assert)(pdfDataRangeTransport);
            this._queuedChunks = [];
            var initialData = params.initialData;

            if (initialData && initialData.length > 0) {
              var buffer = new Uint8Array(initialData).buffer;

              this._queuedChunks.push(buffer);
            }

            this._pdfDataRangeTransport = pdfDataRangeTransport;
            this._isStreamingSupported = !params.disableStream;
            this._isRangeSupported = !params.disableRange;
            this._contentLength = params.length;
            this._fullRequestReader = null;
            this._rangeReaders = [];

            this._pdfDataRangeTransport.addRangeListener(function(
              begin,
              chunk
            ) {
              _this._onReceiveData({
                begin: begin,
                chunk: chunk
              });
            });

            this._pdfDataRangeTransport.addProgressListener(function(loaded) {
              _this._onProgress({
                loaded: loaded
              });
            });

            this._pdfDataRangeTransport.addProgressiveReadListener(function(
              chunk
            ) {
              _this._onReceiveData({
                chunk: chunk
              });
            });

            this._pdfDataRangeTransport.transportReady();
          }
