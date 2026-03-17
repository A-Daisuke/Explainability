              function ReadableByteStreamControllerEnqueue(controller, chunk) {
                var stream = controller._controlledReadableStream;
                assert(controller._closeRequested === false);
                assert(stream._state === "readable");
                var buffer = chunk.buffer;
                var byteOffset = chunk.byteOffset;
                var byteLength = chunk.byteLength;
                var transferredBuffer = TransferArrayBuffer(buffer);

                if (ReadableStreamHasDefaultReader(stream) === true) {
                  if (ReadableStreamGetNumReadRequests(stream) === 0) {
                    ReadableByteStreamControllerEnqueueChunkToQueue(
                      controller,
                      transferredBuffer,
                      byteOffset,
                      byteLength
                    );
                  } else {
                    assert(controller._queue.length === 0);
                    var transferredView = new Uint8Array(
                      transferredBuffer,
                      byteOffset,
                      byteLength
                    );
                    ReadableStreamFulfillReadRequest(
                      stream,
                      transferredView,
                      false
                    );
                  }
                } else if (ReadableStreamHasBYOBReader(stream) === true) {
                  ReadableByteStreamControllerEnqueueChunkToQueue(
                    controller,
                    transferredBuffer,
                    byteOffset,
                    byteLength
                  );
                  ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(
                    controller
                  );
                } else {
                  assert(
                    IsReadableStreamLocked(stream) === false,
                    "stream must not be locked"
                  );
                  ReadableByteStreamControllerEnqueueChunkToQueue(
                    controller,
                    transferredBuffer,
                    byteOffset,
                    byteLength
                  );
                }
              }
