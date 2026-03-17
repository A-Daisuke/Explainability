function __method_wrapper__() {
  console[method] = (...args) => {
    let error = null;
    if (typeof args[0] === 'string') {
      let format = args[0].match(/%[oOdisfc]/g);
      if (format) {
        let errorIndex = format.findIndex(
          match => match === '%o' || match === '%O',
        );
        if (errorIndex < 0) {
          errorIndex = format.findIndex(match => match === '%s');
        }
        if (errorIndex >= 0) {
          error = args[errorIndex + 1];
        } else {
          error = args[1];
        }

        if (!(error instanceof Error)) {
          let index = 1;
          let message = args[0].replace(/%[oOdisfc]/g, match => {
            switch (match) {
              case '%s':
                return String(args[index++]);
              case '%f':
                return parseFloat(args[index++]);
              case '%d':
              case '%i':
                return parseInt(args[index++], 10);
              case '%o':
              case '%O':
                if (args[index] instanceof Error) {
                  return String(args[index++]);
                } else {
                  return JSON.stringify(args[index++]);
                }
              case '%c':
                index++;
                return '';
            }
          });

          error = new Error(message);
        }
      } else {
        error = new Error(args[0]);
      }
    } else {
      error = args.find(arg => arg instanceof Error);
    }

    if (
      error &&
      !error.message.includes('[parcel]') &&
      typeof window !== 'undefined' &&
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__
    ) {
      // Attempt to append the React component stack
      // TODO: use React.captureOwnerStack once stable.
      let hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (hook.renderers instanceof Map) {
        for (let renderer of hook.renderers.values()) {
          if (
            typeof renderer?.currentDispatcherRef?.getCurrentStack ===
            'function'
          ) {
            let stack = renderer.currentDispatcherRef.getCurrentStack();
            if (stack) {
              error.stack += stack;
              break;
            }
          }
        }
      }

      onError(error);
    }

    original.apply(console, args);
  };

}
