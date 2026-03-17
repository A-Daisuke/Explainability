function __method_wrapper__() {
  function* genFnParent() {
    try {
      yield io.put({
        type: 'start',
      })
      yield io.call(fail, 'failure')
      yield io.put({
        type: 'success',
      })
    } catch (e) {
      yield io.put({
        type: e,
      })
    }
  }

}
