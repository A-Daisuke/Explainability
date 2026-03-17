function __method_wrapper__() {
  proto.inputOptions = function(options) {
    if (!this._currentInput) {
      throw new Error('No input specified');
    }

    var doSplit = true;

    if (arguments.length > 1) {
      options = [].slice.call(arguments);
      doSplit = false;
    }

    if (!Array.isArray(options)) {
      options = [options];
    }

    this._currentInput.options(options.reduce(function(options, option) {
      var split = String(option).split(' ');

      if (doSplit && split.length === 2) {
        options.push(split[0], split[1]);
      } else {
        options.push(option);
      }

      return options;
    }, []));
    return this;
  };

}
