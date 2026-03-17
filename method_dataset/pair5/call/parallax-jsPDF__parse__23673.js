function __method_wrapper__() {
  HmtxTable.prototype.parse = function (data) {
    var i, last, lsbCount, m, _j, _ref, _results;
    data.pos = this.offset;
    this.metrics = [];
    for (i = 0, _ref = this.file.hhea.numberOfMetrics; 0 <= _ref ? i < _ref : i > _ref; i = 0 <= _ref ? ++i : --i) {
      this.metrics.push({
        advance: data.readUInt16(),
        lsb: data.readInt16()
      });
    }
    lsbCount = this.file.maxp.numGlyphs - this.file.hhea.numberOfMetrics;
    this.leftSideBearings = function () {
      var _j, _results;
      _results = [];
      for (i = _j = 0; 0 <= lsbCount ? _j < lsbCount : _j > lsbCount; i = 0 <= lsbCount ? ++_j : --_j) {
        _results.push(data.readInt16());
      }
      return _results;
    }();
    this.widths = function () {
      var _j, _len, _ref1, _results;
      _ref1 = this.metrics;
      _results = [];
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        m = _ref1[_j];
        _results.push(m.advance);
      }
      return _results;
    }.call(this);
    last = this.widths[this.widths.length - 1];
    _results = [];
    for (i = _j = 0; 0 <= lsbCount ? _j < lsbCount : _j > lsbCount; i = 0 <= lsbCount ? ++_j : --_j) {
      _results.push(this.widths.push(last));
    }
    return _results;
  };

}
