const __obj__ = {
                value: function onReceiveProgressiveData(data) {
                  var position = this.progressiveDataLength;
                  var beginChunk = Math.floor(position / this.chunkSize);
                  this.bytes.set(new Uint8Array(data), position);
                  position += data.byteLength;
                  this.progressiveDataLength = position;
                  var endChunk =
                    position >= this.end
                      ? this.numChunks
                      : Math.floor(position / this.chunkSize);

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

};
