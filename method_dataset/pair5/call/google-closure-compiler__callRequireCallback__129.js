function callRequireCallback(callback, opt_module) {
  var oldPath = currentModulePath;

  try {
    if (opt_module) {
      currentModulePath = opt_module.id;
      callback.call(
          opt_module, createRequire(opt_module), opt_module.exports,
          opt_module);
    } else {
      callback($jscomp.require);
    }
  } finally {
    currentModulePath = oldPath;
  }
}
