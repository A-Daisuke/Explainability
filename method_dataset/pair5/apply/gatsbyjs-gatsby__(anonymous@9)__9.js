function __method_wrapper__() {
  return new Promise((resolve, reject) => {
    const webpackResolver = {
      doResolve: doResolveMock,
      ensureHook: (hook: string): string => hook,
      getHook: (): Record<string, unknown> => {
        return {
          tapAsync: (
            _name: string,
            fn: (...args: Array<unknown>) => void
          ): void => {
            fn(request, null, (err, result) =>
              err ? reject(err) : resolve(result)
            )
          },
        }
      },
    }

    resolver.apply(webpackResolver)
  })

}
