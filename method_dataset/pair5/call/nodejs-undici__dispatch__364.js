function __method_wrapper__() {
  return function dispatch (opts, handler) {
    if (agent.isMockActive) {
      try {
        mockDispatch.call(this, opts, handler)
      } catch (error) {
        if (error.code === 'UND_MOCK_ERR_MOCK_NOT_MATCHED') {
          const netConnect = agent[kGetNetConnect]()
          if (netConnect === false) {
            throw new MockNotMatchedError(`${error.message}: subsequent request to origin ${origin} was not allowed (net.connect disabled)`)
          }
          if (checkNetConnect(netConnect, origin)) {
            originalDispatch.call(this, opts, handler)
          } else {
            throw new MockNotMatchedError(`${error.message}: subsequent request to origin ${origin} was not allowed (net.connect is not enabled for this origin)`)
          }
        } else {
          throw error
        }
      }
    } else {
      originalDispatch.call(this, opts, handler)
    }
  }

}
