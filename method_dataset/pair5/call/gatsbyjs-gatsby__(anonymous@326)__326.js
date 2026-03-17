function __method_wrapper__() {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      try {
        const oldEntry = compilation.entries.get(options.name)
        if (!oldEntry) {
          resolve(null)
          return
        }

        oldEntry.includeDependencies.push(entry)
        compilation.hooks.addEntry.call(entry, options)
        compilation.addModuleTree(
          {
            context,
            dependency: entry,
          },
          // @ts-ignore
          (err: Error | undefined, module: any) => {
            if (err) {
              compilation.hooks.failedEntry.call(entry, options, err)
              return reject(err)
            }

            compilation.hooks.succeedEntry.call(entry, options, module)
            return resolve(module)
          }
        )
      } catch (e) {
        console.log({ e })
        reject(e)
      }
    })

}
