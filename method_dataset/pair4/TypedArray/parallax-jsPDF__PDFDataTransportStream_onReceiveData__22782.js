function __method_wrapper__() {
            _onReceiveData: function PDFDataTransportStream_onReceiveData(
              args
            ) {
              var buffer = new Uint8Array(args.chunk).buffer;

              if (args.begin === undefined) {
                if (this._fullRequestReader) {
                  this._fullRequestReader._enqueue(buffer);
                } else {
                  this._queuedChunks.push(buffer);
                }
              } else {
                var found = this._rangeReaders.some(function(rangeReader) {
                  if (rangeReader._begin !== args.begin) {
                    return false;
                  }

                  rangeReader._enqueue(buffer);

                  return true;
                });

                (0, _util.assert)(found);
              }
            },

}
