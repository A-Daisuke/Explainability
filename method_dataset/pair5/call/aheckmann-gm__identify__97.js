function __method_wrapper__() {
  proto.identify = function identify (opts, callback) {
    // identify with pattern
    if (typeof(opts) === 'string') {
      opts = {
        format: opts
      }
    }
    if (!callback) callback = opts, opts = {};
    if (!callback) return this;
    if (opts && opts.format) return identifyPattern.call(this, opts, callback);

    var self = this;

    if (IDENTIFIED === self._identifyState) {
      callback.call(self, null, self.data);
      return self;
    }

    self.on('identify', callback);

    if (IDENTIFYING === self._identifyState) {
      return self;
    }

    self._identifyState = IDENTIFYING;

    self.bufferStream = !!opts.bufferStream;

    var args = makeArgs(self, { verbose: true });

    self._exec(args, function (err, stdout, stderr, cmd) {
      if (err) {
        self.emit('identify', err, self.data, stdout, stderr, cmd);
        return;
      }

      err = parse(stdout, self);

      if (err) {
        self.emit('identify', err, self.data, stdout, stderr, cmd);
        return;
      }

      self.data.path = self.source;

      self.emit('identify', null, self.data);
      self._identifyState = IDENTIFIED;
    });

    return self;
  }

}
