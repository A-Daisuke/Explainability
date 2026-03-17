function __method_wrapper__() {
        return iterator.next().then(({ done, value }) => {
          if (done) {
            return queueMicrotask(() => {
              controller.close()
              controller.byobRequest?.respond(0)
            })
          } else {
            const buf = Buffer.isBuffer(value) ? value : Buffer.from(value)
            if (buf.byteLength) {
              return controller.enqueue(new Uint8Array(buf))
            } else {
              return this.pull(controller)
            }
          }
        })

}
