function __method_wrapper__() {
  Object.keys(source).forEach(function (key) {
    if (
      key === 'default' ||
      key === '__esModule' ||
      Object.prototype.hasOwnProperty.call(dest, key)
    ) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function () {
        return source[key];
      },
    });
  });

}
