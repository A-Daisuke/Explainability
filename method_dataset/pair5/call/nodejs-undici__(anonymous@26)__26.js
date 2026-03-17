function __method_wrapper__() {
    test(`Should properly configure the ${type} eventhandler idl`, (t) => {
      const eventSourceInstance = new EventSource(`http://localhost:${port}`)

      // Eventsource eventhandler idl is by default null,
      t.assert.strictEqual(eventSourceInstance[type], null)

      // The eventhandler idl is by default not enumerable.
      t.assert.strictEqual(Object.prototype.propertyIsEnumerable.call(eventSourceInstance, type), false)

      // The eventhandler idl ignores non-functions.
      eventSourceInstance[type] = 7
      t.assert.strictEqual(EventSource[type], undefined)

      // The eventhandler idl accepts functions.
      function fn () {
        t.assert.fail('Should not have called the eventhandler')
      }
      eventSourceInstance[type] = fn
      t.assert.strictEqual(eventSourceInstance[type], fn)

      // The eventhandler idl can be set to another function.
      function fn2 () { }
      eventSourceInstance[type] = fn2
      t.assert.strictEqual(eventSourceInstance[type], fn2)

      // The eventhandler idl overrides the previous function.
      eventSourceInstance.dispatchEvent(new Event(type))

      eventSourceInstance.close()
    })

}
