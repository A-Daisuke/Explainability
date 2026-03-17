function __method_wrapper__() {
    test(`Should expose the ${config[0]} constant`, (t) => {
      const [constant, value] = config

      // EventSource exposes the constant.
      t.assert.strictEqual(Object.hasOwn(EventSource, constant), true)

      // The value is properly set.
      t.assert.strictEqual(EventSource[constant], value)

      // The constant is enumerable.
      t.assert.strictEqual(Object.prototype.propertyIsEnumerable.call(EventSource, constant), true)

      // The constant is not writable.
      try {
        EventSource[constant] = 666
      } catch (e) {
        t.assert.strictEqual(e instanceof TypeError, true)
      }
      // The constant is not configurable.
      try {
        delete EventSource[constant]
      } catch (e) {
        t.assert.strictEqual(e instanceof TypeError, true)
      }
      t.assert.strictEqual(EventSource[constant], value)
    })

}
