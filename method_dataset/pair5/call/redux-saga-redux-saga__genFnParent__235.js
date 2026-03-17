function __method_wrapper__() {
  function* genFnParent() {
    try {
      yield io.put({
        type: 'start parent',
      })
      yield io.call(genFnChild)
      yield io.put({
        type: 'success parent',
      })
    } catch (e) {
      yield io.put({
        type: e,
      })
      yield io.put({
        type: 'failure parent',
      })
    }
  }

}
