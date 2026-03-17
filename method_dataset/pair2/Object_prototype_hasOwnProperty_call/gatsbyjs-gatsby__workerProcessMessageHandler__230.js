      const workerProcessMessageHandler = (msg: ChildMessageUnion): void => {
        if (!Array.isArray(msg)) {
          // all gatsby-worker messages should be an array
          // if it's not an array we skip it
          return
        } else if (msg[1] <= workerInfo.lastMessage) {
          // this message was already handled, so skipping it
          // this is specifically for special casing worker exits
          // where we serialize "in-flight" IPC messages to fs
          // and "replay" them here to ensure no messages are lost
          // Trickiness is that while we write out in flight IPC messages
          // to fs, those messages might actually still go through as regular
          // ipc messages so we have to ensure we don't handle same message twice
          return
        } else if (msg[1] !== workerInfo.lastMessage + 1) {
          // TODO: figure out IPC message order guarantees (or lack of them) - for now
          // condition above relies on IPC messages being received in same order
          // as they were sent via `process.send` in child process
          // generally we expect messages we receive to be next one (lastMessage + 1)
          // IF order is not guaranteed, then different strategy for de-duping messages
          // is needed.
          throw new Error(
            `[gatsby-worker] Out of order message. Expected ${
              workerInfo.lastMessage + 1
            }, got ${msg[1]}.\n\nFull message:\n${JSON.stringify(
              msg,
              null,
              2
            )}.`
          )
        }
        workerInfo.lastMessage = msg[1]
        if (msg[0] === RESULT) {
          if (!workerInfo.currentTask) {
            throw new Error(
              `Invariant: gatsby-worker received execution result, but it wasn't expecting it.`
            )
          }
          const task = workerInfo.currentTask
          workerInfo.currentTask = undefined
          this.checkForWork(workerInfo)
          task.resolve(msg[2])
        } else if (msg[0] === ERROR) {
          if (!workerInfo.currentTask) {
            throw new Error(
              `Invariant: gatsby-worker received execution rejection, but it wasn't expecting it.`
            )
          }

          let error = msg[5]

          if (error !== null && typeof error === `object`) {
            const extra = error

            const NativeCtor = global[msg[2]]
            const Ctor = typeof NativeCtor === `function` ? NativeCtor : Error

            error = new Ctor(msg[3])
            // @ts-ignore type doesn't exist on Error, but that's what jest-worker does for errors :shrug:
            error.type = msg[2]
            error.stack = msg[4]

            for (const key in extra) {
              if (Object.prototype.hasOwnProperty.call(extra, key)) {
                error[key] = extra[key]
              }
            }
          }

          const task = workerInfo.currentTask
          workerInfo.currentTask = undefined
          this.checkForWork(workerInfo)
          task.reject(error)
        } else if (msg[0] === CUSTOM_MESSAGE) {
          for (const listener of this.listeners) {
            listener(msg[2] as MessagesFromChild, workerId)
          }
        } else if (msg[0] === WORKER_READY) {
          workerReadyResolve()
        }
      }
