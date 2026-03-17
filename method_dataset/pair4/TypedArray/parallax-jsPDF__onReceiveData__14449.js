function __method_wrapper__() {
                value: function onReceiveData(begin, chunk) {
                  var chunkSize = this.chunkSize;

                  if (begin % chunkSize !== 0) {
                    throw new Error("Bad begin offset: ".concat(begin));
                  }

                  var end = begin + chunk.byteLength;

                  if (end % chunkSize !== 0 && end !== this.bytes.length) {
                    throw new Error("Bad end offset: ".concat(end));
                  }

                  this.bytes.set(new Uint8Array(chunk), begin);
                  var beginChunk = Math.floor(begin / chunkSize);
                  var endChunk = Math.floor((end - 1) / chunkSize) + 1;

                  for (
                    var curChunk = beginChunk;
                    curChunk < endChunk;
                    ++curChunk
                  ) {
                    if (!this.loadedChunks[curChunk]) {
                      this.loadedChunks[curChunk] = true;
                      ++this.numChunksLoaded;
                    }
                  }
                }

}
