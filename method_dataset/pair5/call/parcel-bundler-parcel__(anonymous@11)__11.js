function __method_wrapper__() {
    return function (args) {
      // Call immediately if last call was more than the delay ago.
      // Otherwise, set a timeout. This means the first call is fast
      // (for the common case of a single update), and subsequent updates
      // are batched.
      let now = Date.now();
      if (now - lastTime > delay) {
        lastTime = now;
        func.call(null, args);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          timeout = undefined;
          lastTime = Date.now();
          func.call(null, args);
        }, delay);
      }
    };

}
