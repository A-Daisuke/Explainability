function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    function u(e, t) {
      (e.row -= t.row), e.row == 0 && (e.column -= t.column);
    }
    function a(e, t) {
      u(e.start, t), u(e.end, t);
    }
    function f(e, t) {
      e.row == 0 && (e.column += t.column), (e.row += t.row);
    }
    function l(e, t) {
      f(e.start, t), f(e.end, t);
    }
    var r = e("../range").Range,
      i = e("../range_list").RangeList,
      s = e("../lib/oop"),
      o = (t.Fold = function(e, t) {
        (this.foldLine = null),
          (this.placeholder = t),
          (this.range = e),
          (this.start = e.start),
          (this.end = e.end),
          (this.sameRow = e.start.row == e.end.row),
          (this.subFolds = this.ranges = []);
      });
    s.inherits(o, i),
      function() {
        (this.toString = function() {
          return '"' + this.placeholder + '" ' + this.range.toString();
        }),
          (this.setFoldLine = function(e) {
            (this.foldLine = e),
              this.subFolds.forEach(function(t) {
                t.setFoldLine(e);
              });
          }),
          (this.clone = function() {
            var e = this.range.clone(),
              t = new o(e, this.placeholder);
            return (
              this.subFolds.forEach(function(e) {
                t.subFolds.push(e.clone());
              }),
              (t.collapseChildren = this.collapseChildren),
              t
            );
          }),
          (this.addSubFold = function(e) {
            if (this.range.isEqual(e)) return;
            if (!this.range.containsRange(e))
              throw new Error(
                "A fold can't intersect already existing fold" +
                  e.range +
                  this.range
              );
            a(e, this.start);
            var t = e.start.row,
              n = e.start.column;
            for (var r = 0, i = -1; r < this.subFolds.length; r++) {
              i = this.subFolds[r].range.compare(t, n);
              if (i != 1) break;
            }
            var s = this.subFolds[r];
            if (i == 0) return s.addSubFold(e);
            var t = e.range.end.row,
              n = e.range.end.column;
            for (var o = r, i = -1; o < this.subFolds.length; o++) {
              i = this.subFolds[o].range.compare(t, n);
              if (i != 1) break;
            }
            var u = this.subFolds[o];
            if (i == 0)
              throw new Error(
                "A fold can't intersect already existing fold" +
                  e.range +
                  this.range
              );
            var f = this.subFolds.splice(r, o - r, e);
            return e.setFoldLine(this.foldLine), e;
          }),
          (this.restoreRange = function(e) {
            return l(e, this.start);
          });
      }.call(o.prototype);
  }),

}
