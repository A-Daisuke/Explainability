            function ChunkedStream(length, chunkSize, manager) {
              _classCallCheck(this, ChunkedStream);

              this.bytes = new Uint8Array(length);
              this.start = 0;
              this.pos = 0;
              this.end = length;
              this.chunkSize = chunkSize;
              this.loadedChunks = [];
              this.numChunksLoaded = 0;
              this.numChunks = Math.ceil(length / chunkSize);
              this.manager = manager;
              this.progressiveDataLength = 0;
              this.lastSuccessfulEnsureByteChunk = -1;
            }
