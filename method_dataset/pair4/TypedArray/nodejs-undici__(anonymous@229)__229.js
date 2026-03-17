function __method_wrapper__() {
        return iterator.next().then(({ value, done }) => {
          if (done) {
            // When running action is done, close stream.
            queueMicrotask(() => {
              controller.close()
              controller.byobRequest?.respond(0)
            })
          } else {
            // Whenever one or more bytes are available and stream is not errored,
            // enqueue a Uint8Array wrapping an ArrayBuffer containing the available
            // bytes into stream.
            if (!isErrored(stream)) {
              const buffer = new Uint8Array(value)
              if (buffer.byteLength) {
                controller.enqueue(buffer)
              }
            }
          }
          return controller.desiredSize > 0
        })

}
