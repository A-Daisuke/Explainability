function __method_wrapper__() {
  [kGetDispatcher] () {
    const clientTtlOption = this[kOptions].clientTtl
    for (const client of this[kClients]) {
      // check ttl of client and if it's stale, remove it from the pool
      if (clientTtlOption != null && clientTtlOption > 0 && client.ttl && ((Date.now() - client.ttl) > clientTtlOption)) {
        this[kRemoveClient](client)
      } else if (!client[kNeedDrain]) {
        return client
      }
    }

    if (!this[kConnections] || this[kClients].length < this[kConnections]) {
      const dispatcher = this[kFactory](this[kUrl], this[kOptions])
      this[kAddClient](dispatcher)
      return dispatcher
    }
  }

}
