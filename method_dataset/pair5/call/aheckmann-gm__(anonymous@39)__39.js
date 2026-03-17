function __method_wrapper__() {
    proto[getter] = function (opts, callback) {
      if (!callback) callback = opts, opts = {};
      if (!callback) return this;

      var val = map[getter]
        , key = val.key
        , self = this;

      if (self.data[key]) {
        callback.call(self, null, self.data[key]);
        return self;
      }

      self.on(getter, callback);

      self.bufferStream = !!opts.bufferStream;

      if (val.verbose) {
        self.identify(opts, function (err, stdout, stderr, cmd) {
          if (err) {
            self.emit(getter, err, self.data[key], stdout, stderr, cmd);
          } else {
            self.emit(getter, err, self.data[key]);
          }
        });
        return self;
      }

      var args = makeArgs(self, val);
      self._exec(args, function (err, stdout, stderr, cmd) {
        if (err) {
          self.emit(getter, err, self.data[key], stdout, stderr, cmd);
          return;
        }

        var result = (stdout||'').trim();

        if (val.helper in helper) {
          helper[val.helper](self.data, result);
        } else {
          self.data[key] = result;
        }

        self.emit(getter, err, self.data[key]);
      });

      return self;
    }

}
