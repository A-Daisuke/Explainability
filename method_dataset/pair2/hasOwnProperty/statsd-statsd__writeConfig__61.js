function __method_wrapper__() {
exports.writeConfig = function(config, stream) {
  stream.write("\n");
  for (const prop in config) {
    if (!config.hasOwnProperty(prop)) {
      continue;
    }
    if (typeof config[prop] !== 'object') {
      stream.write(prop + ": " + config[prop] + "\n");
      continue;
    }
    const subconfig = config[prop];
    for (const subprop in subconfig) {
      if (!subconfig.hasOwnProperty(subprop)) {
        continue;
      }
      stream.write(prop + " > " + subprop + ": " + subconfig[subprop] + "\n");
    }
  }
};

}
