function __method_wrapper__() {
  function* genFnChild() {
    try {
      yield io.put({
        type: 'startChild',
      })
      yield io.call(fail, 'child error')
      yield io.put({
        type: 'success child',
      })
    } catch (e) {
      yield io.put({
        type: 'failure child',
      })
    }
  }

}
