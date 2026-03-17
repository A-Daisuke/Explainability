function __method_wrapper__() {
  ;(async () => {
    while (!fr[kAborted]) {
      // 1. Wait for chunkPromise to be fulfilled or rejected.
      try {
        const { done, value } = await chunkPromise

        // 2. If chunkPromise is fulfilled, and isFirstChunk is
        //    true, queue a task to fire a progress event called
        //    loadstart at fr.
        if (isFirstChunk && !fr[kAborted]) {
          queueMicrotask(() => {
            fireAProgressEvent('loadstart', fr)
          })
        }

        // 3. Set isFirstChunk to false.
        isFirstChunk = false

        // 4. If chunkPromise is fulfilled with an object whose
        //    done property is false and whose value property is
        //    a Uint8Array object, run these steps:
        if (!done && types.isUint8Array(value)) {
          // 1. Let bs be the byte sequence represented by the
          //    Uint8Array object.

          // 2. Append bs to bytes.
          bytes.push(value)

          // 3. If roughly 50ms have passed since these steps
          //    were last invoked, queue a task to fire a
          //    progress event called progress at fr.
          if (
            (
              fr[kLastProgressEventFired] === undefined ||
              Date.now() - fr[kLastProgressEventFired] >= 50
            ) &&
            !fr[kAborted]
          ) {
            fr[kLastProgressEventFired] = Date.now()
            queueMicrotask(() => {
              fireAProgressEvent('progress', fr)
            })
          }

          // 4. Set chunkPromise to the result of reading a
          //    chunk from stream with reader.
          chunkPromise = reader.read()
        } else if (done) {
          // 5. Otherwise, if chunkPromise is fulfilled with an
          //    object whose done property is true, queue a task
          //    to run the following steps and abort this algorithm:
          queueMicrotask(() => {
            // 1. Set fr’s state to "done".
            fr[kState] = 'done'

            // 2. Let result be the result of package data given
            //    bytes, type, blob’s type, and encodingName.
            try {
              const result = packageData(bytes, type, blob.type, encodingName)

              // 4. Else:

              if (fr[kAborted]) {
                return
              }

              // 1. Set fr’s result to result.
              fr[kResult] = result

              // 2. Fire a progress event called load at the fr.
              fireAProgressEvent('load', fr)
            } catch (error) {
              // 3. If package data threw an exception error:

              // 1. Set fr’s error to error.
              fr[kError] = error

              // 2. Fire a progress event called error at fr.
              fireAProgressEvent('error', fr)
            }

            // 5. If fr’s state is not "loading", fire a progress
            //    event called loadend at the fr.
            if (fr[kState] !== 'loading') {
              fireAProgressEvent('loadend', fr)
            }
          })

          break
        }
      } catch (error) {
        if (fr[kAborted]) {
          return
        }

        // 6. Otherwise, if chunkPromise is rejected with an
        //    error error, queue a task to run the following
        //    steps and abort this algorithm:
        queueMicrotask(() => {
          // 1. Set fr’s state to "done".
          fr[kState] = 'done'

          // 2. Set fr’s error to error.
          fr[kError] = error

          // 3. Fire a progress event called error at fr.
          fireAProgressEvent('error', fr)

          // 4. If fr’s state is not "loading", fire a progress
          //    event called loadend at fr.
          if (fr[kState] !== 'loading') {
            fireAProgressEvent('loadend', fr)
          }
        })

        break
      }
    }
  })()

}
