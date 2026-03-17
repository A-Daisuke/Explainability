  function messageHandler(msg: ParentMessageUnion): void {
    if (msg[0] === EXECUTE) {
      let result
      try {
        result = child[msg[2]].call(child, ...msg[3])
      } catch (e) {
        onError(e)
        return
      }

      if (isPromise(result)) {
        result.then(onResult, onError)
      } else {
        onResult(result)
      }
    } else if (msg[0] === END) {
      process.off(`message`, messageHandler)
    } else if (msg[0] === CUSTOM_MESSAGE) {
      for (const listener of listeners) {
        listener(msg[2])
      }
    }
  }
