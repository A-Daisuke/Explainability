function __method_wrapper__() {
    return function (key: string, value: any): any {
      if (stack.length > 0) {
        const thisPos = stack.indexOf(this);
        ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
        ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
        if (maxDepth != null && thisPos > maxDepth) {
          return '[Max depth reached]';
        } else {
          if (~stack.indexOf(value)) {
            value = (cycleReplacer as DebuggerClientCycleReplacer).call(
              this,
              key,
              value
            );
          }
        }
      } else {
        stack.push(value);
      }
      return replacer == null ? value : replacer.call(this, key, value);
    };

}
