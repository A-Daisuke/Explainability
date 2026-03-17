class __C__ {
    maybeCreateAndThrowError(name, message) {
      const errorClass = global[name];

      // Check if the error class exists and is a subclass of Error
      if (
        typeof errorClass === "function" &&
        errorClass.prototype.isPrototypeOf.call(Error)
      ) {
        throw new errorClass(message);
      }

      class DynamicError extends Error {
        constructor(msg) {
          super(msg);
          this.name = name;
        }
      }
      throw new DynamicError(message);
    },

}
