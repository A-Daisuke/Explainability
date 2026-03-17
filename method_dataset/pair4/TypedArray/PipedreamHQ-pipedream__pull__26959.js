function __method_wrapper__() {
      async pull (controller) {
        const { value, done } = await iterator.next()
        if (done) {
          // When running action is done, close stream.
          queueMicrotask(() => {
            controller.close()
          })
        } else {
          // Whenever one or more bytes are available and stream is not errored,
          // enqueue a Uint8Array wrapping an ArrayBuffer containing the available
          // bytes into stream.
          if (!isErrored(stream)) {
            controller.enqueue(new Uint8Array(value))
          }
        }
        return controller.desiredSize > 0
      },

}
