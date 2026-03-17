function __method_wrapper__() {
    LocaTable.prototype.parse = function (data) {
      var format, i;
      data.pos = this.offset;
      format = this.file.head.indexToLocFormat;
      if (format === 0) {
        return this.offsets = function () {
          var _ref, _results;
          _results = [];
          for (i = 0, _ref = this.length; i < _ref; i += 2) {
            _results.push(data.readUInt16() * 2);
          }
          return _results;
        }.call(this);
      } else {
        return this.offsets = function () {
          var _ref, _results;
          _results = [];
          for (i = 0, _ref = this.length; i < _ref; i += 4) {
            _results.push(data.readUInt32());
          }
          return _results;
        }.call(this);
      }
    };

}
