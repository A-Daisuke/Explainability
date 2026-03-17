function createContext(options) {
  // Create a fresh global context to execute code in on each build to avoid memory leaks.
  // $FlowFixMe
  let context: any = vm.createContext(vm.constants.DONT_CONTEXTIFY);
  context.global = context;
  context.AsyncLocalStorage = AsyncLocalStorage;
  context.process = new Proxy(process, {
    get(target, prop, receiver) {
      // Expose the provided environment variables from Parcel instead of the global ones.
      if (prop === 'env') {
        return options.env;
      }

      return Reflect.get(target, prop, receiver);
    },
  });

  // $FlowFixMe
  for (let key of Object.getOwnPropertyNames(globalThis)) {
    if (!context.hasOwnProperty(key)) {
      Object.defineProperty(
        context,
        key,
        // $FlowFixMe
        Object.getOwnPropertyDescriptor(globalThis, key),
      );
    }
  }

  return context;
}
