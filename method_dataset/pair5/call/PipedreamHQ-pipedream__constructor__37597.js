function __method_wrapper__() {
  constructor (origin, opts) {
    super(origin, opts)

    if (!opts || !opts.agent || typeof opts.agent.dispatch !== 'function') {
      throw new InvalidArgumentError('Argument opts.agent must implement Agent')
    }

    this[kMockAgent] = opts.agent
    this[kOrigin] = origin
    this[kDispatches] = []
    this[kConnected] = 1
    this[kOriginalDispatch] = this.dispatch
    this[kOriginalClose] = this.close.bind(this)

    this.dispatch = buildMockDispatch.call(this)
    this.close = this[kClose]
  }

}
