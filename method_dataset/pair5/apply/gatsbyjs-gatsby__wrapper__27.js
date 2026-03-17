function __method_wrapper__() {
        return function wrapper(...args) {
          const myErrorHolder = {
            name: `Unsafe builtin usage ${path}`,
          }
          Error.captureStackTrace(myErrorHolder, wrapper)

          // - loadPageDataSync already is tracked with dedicated warning messages,
          // so skipping marking it to avoid multiple messages for same usage
          // - node-gyp-build will use fs.readDirSync in attempt to load binaries
          // this should be ok to ignore.
          if (
            !myErrorHolder.stack.includes(`loadPageDataSync`) &&
            !myErrorHolder.stack.includes(`node-gyp-build`)
          ) {
            global.unsafeBuiltinUsage.push(myErrorHolder.stack)
          }

          return value.apply(target, args)
        }

}
