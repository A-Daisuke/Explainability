async function build(dockerExec) {
  let code = 139
  let start = 0

  // there's something buggy with the node/exec/docker-exec integration
  // we're getting seg faults, so this loop is just a patch for that
  // so we don't have to fix it right now

  while(code === 139) {
    try {    
      console.log(` - clearing cache`)
      await dockerExec(`rm -rf .cache`)

      console.log(` - running build with ${args.numNodes} nodes of size ${args.nodeSize}`)

      start = Date.now()
      const { err  } = await dockerExec(
        `yarn gatsby build`, 
        {
          BUILD_NUM_NODES: args.numNodes, 
          BUILD_STRING_NODE_SIZE: args.nodeSize, 
          NUM_KEYS_IN_LARGE_SIZE_OBJ: 1,
        }
      )
      code = err.code

    } catch (e) {
      code = e.code
    }

    if (code === 139) {
      console.log(`     \x1b[31mSeg fault, trying again\x1b[0m`)
    }
  }

  return {
    code,
    time: Math.round((Date.now() - start) / 10) / 100
  }
}
