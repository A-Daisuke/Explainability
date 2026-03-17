function __method_wrapper__() {
    fn.foo = function __safeCallWrapper() {
      try {
        return fn.apply(this, arguments);
      } catch (e) {
        var stack = e.stack || "";
        if (~stack.indexOf(" at ")) stack = stack.split(" at ")[1];
        var m = "Error in function " + stack.split("\n")[0].split("<")[0] + ": " + e.message;
        if (globalObject.console) {
          globalObject.console.error(m, e);
          if (globalObject.alert) alert(m);
        } else {
          throw new Error(m);
        }
      }
    };

}
