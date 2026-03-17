function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("./lib/lang"),
      i = e("./lib/oop"),
      s = e("./range").Range,
      o = function(e, t, n) {
        this.setRegexp(e), (this.clazz = t), (this.type = n || "text");
      };
    (function() {
      (this.MAX_RANGES = 500),
        (this.setRegexp = function(e) {
          if (this.regExp + "" == e + "") return;
          (this.regExp = e), (this.cache = []);
        }),
        (this.update = function(e, t, n, i) {
          if (!this.regExp) return;
          var o = i.firstRow,
            u = i.lastRow;
          for (var a = o; a <= u; a++) {
            var f = this.cache[a];
            f == null &&
              ((f = r.getMatchOffsets(n.getLine(a), this.regExp)),
              f.length > this.MAX_RANGES && (f = f.slice(0, this.MAX_RANGES)),
              (f = f.map(function(e) {
                return new s(a, e.offset, a, e.offset + e.length);
              })),
              (this.cache[a] = f.length ? f : ""));
            for (var l = f.length; l--; )
              t.drawSingleLineMarker(e, f[l].toScreenRange(n), this.clazz, i);
          }
        });
    }.call(o.prototype),
      (t.SearchHighlight = o));
  }),

}
