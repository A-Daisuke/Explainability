function FfmpegCommand(input, options) {
  // Make 'new' optional
  if (!(this instanceof FfmpegCommand)) {
    return new FfmpegCommand(input, options);
  }

  EventEmitter.call(this);

  if (typeof input === 'object' && !('readable' in input)) {
    // Options object passed directly
    options = input;
  } else {
    // Input passed first
    options = options || {};
    options.source = input;
  }

  // Add input if present
  this._inputs = [];
  if (options.source) {
    this.input(options.source);
  }

  // Add target-less output for backwards compatibility
  this._outputs = [];
  this.output();

  // Create argument lists
  var self = this;
  ['_global', '_complexFilters'].forEach(function (prop) {
    self[prop] = utils.args();
  });

  // Set default option values
  options.stdoutLines = 'stdoutLines' in options ? options.stdoutLines : 100;
  options.presets = options.presets || options.preset || path.join(__dirname, 'presets');
  options.niceness = options.niceness || options.priority || 0;

  // Save options
  this.options = options;

  // Setup logger
  this.logger = options.logger || {
    debug: function () { },
    info: function () { },
    warn: function () { },
    error: function () { }
  };
}
