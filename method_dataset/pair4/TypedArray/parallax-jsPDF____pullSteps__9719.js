function __method_wrapper__() {
                    value: function __pullSteps() {
                      var stream = this._controlledReadableStream;
                      assert(ReadableStreamHasDefaultReader(stream) === true);

                      if (this._queueTotalSize > 0) {
                        assert(ReadableStreamGetNumReadRequests(stream) === 0);

                        var entry = this._queue.shift();

                        this._queueTotalSize -= entry.byteLength;
                        ReadableByteStreamControllerHandleQueueDrain(this);
                        var view = void 0;

                        try {
                          view = new Uint8Array(
                            entry.buffer,
                            entry.byteOffset,
                            entry.byteLength
                          );
                        } catch (viewE) {
                          return Promise.reject(viewE);
                        }

                        return Promise.resolve(
                          CreateIterResultObject(view, false)
                        );
                      }

                      var autoAllocateChunkSize = this._autoAllocateChunkSize;

                      if (autoAllocateChunkSize !== undefined) {
                        var buffer = void 0;

                        try {
                          buffer = new ArrayBuffer(autoAllocateChunkSize);
                        } catch (bufferE) {
                          return Promise.reject(bufferE);
                        }

                        var pullIntoDescriptor = {
                          buffer: buffer,
                          byteOffset: 0,
                          byteLength: autoAllocateChunkSize,
                          bytesFilled: 0,
                          elementSize: 1,
                          ctor: Uint8Array,
                          readerType: "default"
                        };

                        this._pendingPullIntos.push(pullIntoDescriptor);
                      }

                      var promise = ReadableStreamAddReadRequest(stream);
                      ReadableByteStreamControllerCallPullIfNeeded(this);
                      return promise;
                    }

}
