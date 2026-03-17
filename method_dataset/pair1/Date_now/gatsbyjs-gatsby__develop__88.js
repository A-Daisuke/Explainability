async function develop(dockerExec) {
  let code = undefined
  let message = undefined
  let start = 0

  while(code === undefined) {
    console.log(` - clearing cache`)
    await dockerExec(`rm -rf .cache`)

    console.log(` - running develop with ${args.numNodes} nodes of size ${args.nodeSize}`)

    start = Date.now()
    const process = dockerExec(
      `yarn gatsby develop -H 0.0.0.0 -p 9000`, 
      {
        BUILD_NUM_NODES: args.numNodes, 
        BUILD_STRING_NODE_SIZE: args.nodeSize, 
        NUM_KEYS_IN_LARGE_SIZE_OBJ: 1
      },
      false
    )

    // wait until we see development bundle was successfully built, then exit
    process.stdout.on('data', (data) => {
      const line = data.toString()
      if (line.indexOf("Building development bundle -") >= 0) {
        message = line.trim()
        code = line.indexOf("success") >= 0 ? 0 : 1
        process.kill()
      }
    })

    process.on('exit', (c) => {
      if (!message) {
        code = c
      }
    })

    while(code === undefined) {
      await new Promise(r => setTimeout(r, 100));
    }

    if (code === 139) {
      console.log(`     \x1b[31mSeg fault, trying again\x1b[0m`)
      code = undefined
    }
  }

  console.log(`\nFinal development message: ${message}`)

  return {
    code,
    time: Math.round((Date.now() - start) / 10) / 100
  }
}
