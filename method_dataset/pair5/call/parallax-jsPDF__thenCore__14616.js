function __method_wrapper__() {
    Worker.prototype.thenCore = function thenCore(onFulfilled, onRejected, thenBase) {
      // Handle optional thenBase parameter.
      thenBase = thenBase || Promise.prototype.then;

      // Wrap `this` for encapsulation and bind it to the promise handlers.
      var self = this;
      if (onFulfilled) {
        onFulfilled = onFulfilled.bind(self);
      }
      if (onRejected) {
        onRejected = onRejected.bind(self);
      }

      // Cast self into a Promise to avoid polyfills recursively defining `then`.
      var isNative = Promise.toString().indexOf("[native code]") !== -1 && Promise.name === "Promise";
      var selfPromise = isNative ? self : Worker.convert(Object.assign({}, self), Promise.prototype);

      // Return the promise, after casting it into a Worker and preserving props.
      var returnVal = thenBase.call(selfPromise, onFulfilled, onRejected);
      return Worker.convert(returnVal, self.__proto__);
    };

}
