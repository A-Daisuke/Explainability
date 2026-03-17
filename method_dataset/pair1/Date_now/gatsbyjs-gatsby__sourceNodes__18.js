function __method_wrapper__() {
exports.sourceNodes = async ({ actions, reporter }) => {
  const contentDigest = Date.now().toString() // make each sourcing mark everything as dirty

  const activity = reporter.createProgress(`Creating test nodes`, NUM_NODES)
  activity.start()

  for (let i = 0; i < NUM_NODES; i++) {
    const largeSizeObj = {}
    for (let j = 1; j <= NUM_KEYS_IN_LARGE_SIZE_OBJ; j++) {
      largeSizeObj[`key_${j}`] = `x`.repeat(1024)
    }

    // each node is ~2MB
    const node = {
      id: `memory-${i}`,
      idClone: `memory-${i}`,
      fooBar: [`foo`, `bar`, `baz`, `foobar`][i % 4],
      number1: i,
      number2: NUM_NODES - i,
      number3: i % 20,
      largeSizeObj,
      largeSizeString: `x`.repeat(LARGE_FIELD_SIZE),
      internal: {
        contentDigest,
        type: `Test`,
      },
    }

    actions.createNode(node)

    if (i % 100 === 99) {
      activity.tick(100)
      await new Promise(resolve => setImmediate(resolve))
    }
  }

  activity.tick(NUM_NODES % 100)

  await new Promise(resolve => setTimeout(resolve, 100))

  activity.end()
}

}
