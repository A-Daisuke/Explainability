function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("./range").Range,
      i = r.comparePoints,
      s = function() {
        this.ranges = [];
      };
    (function() {
      (this.comparePoints = i),
        (this.pointIndex = function(e, t, n) {
          var r = this.ranges;
          for (var s = n || 0; s < r.length; s++) {
            var o = r[s],
              u = i(e, o.end);
            if (u > 0) continue;
            var a = i(e, o.start);
            return u === 0
              ? t && a !== 0
                ? -s - 2
                : s
              : a > 0 || (a === 0 && !t)
              ? s
              : -s - 1;
          }
          return -s - 1;
        }),
        (this.add = function(e) {
          var t = !e.isEmpty(),
            n = this.pointIndex(e.start, t);
          n < 0 && (n = -n - 1);
          var r = this.pointIndex(e.end, t, n);
          return r < 0 ? (r = -r - 1) : r++, this.ranges.splice(n, r - n, e);
        }),
        (this.addList = function(e) {
          var t = [];
          for (var n = e.length; n--; ) t.push.apply(t, this.add(e[n]));
          return t;
        }),
        (this.substractPoint = function(e) {
          var t = this.pointIndex(e);
          if (t >= 0) return this.ranges.splice(t, 1);
        }),
        (this.merge = function() {
          var e = [],
            t = this.ranges;
          t = t.sort(function(e, t) {
            return i(e.start, t.start);
          });
          var n = t[0],
            r;
          for (var s = 1; s < t.length; s++) {
            (r = n), (n = t[s]);
            var o = i(r.end, n.start);
            if (o < 0) continue;
            if (o == 0 && !r.isEmpty() && !n.isEmpty()) continue;
            i(r.end, n.end) < 0 &&
              ((r.end.row = n.end.row), (r.end.column = n.end.column)),
              t.splice(s, 1),
              e.push(n),
              (n = r),
              s--;
          }
          return (this.ranges = t), e;
        }),
        (this.contains = function(e, t) {
          return this.pointIndex({ row: e, column: t }) >= 0;
        }),
        (this.containsPoint = function(e) {
          return this.pointIndex(e) >= 0;
        }),
        (this.rangeAtPoint = function(e) {
          var t = this.pointIndex(e);
          if (t >= 0) return this.ranges[t];
        }),
        (this.clipRows = function(e, t) {
          var n = this.ranges;
          if (n[0].start.row > t || n[n.length - 1].start.row < e) return [];
          var r = this.pointIndex({ row: e, column: 0 });
          r < 0 && (r = -r - 1);
          var i = this.pointIndex({ row: t, column: 0 }, r);
          i < 0 && (i = -i - 1);
          var s = [];
          for (var o = r; o < i; o++) s.push(n[o]);
          return s;
        }),
        (this.removeAll = function() {
          return this.ranges.splice(0, this.ranges.length);
        }),
        (this.attach = function(e) {
          this.session && this.detach(),
            (this.session = e),
            (this.onChange = this.$onChange.bind(this)),
            this.session.on("change", this.onChange);
        }),
        (this.detach = function() {
          if (!this.session) return;
          this.session.removeListener("change", this.onChange),
            (this.session = null);
        }),
        (this.$onChange = function(e) {
          if (e.action == "insert")
            var t = e.start,
              n = e.end;
          else
            var n = e.start,
              t = e.end;
          var r = t.row,
            i = n.row,
            s = i - r,
            o = -t.column + n.column,
            u = this.ranges;
          for (var a = 0, f = u.length; a < f; a++) {
            var l = u[a];
            if (l.end.row < r) continue;
            if (l.start.row > r) break;
            l.start.row == r &&
              l.start.column >= t.column &&
              (l.start.column != t.column || !this.$insertRight) &&
              ((l.start.column += o), (l.start.row += s));
            if (l.end.row == r && l.end.column >= t.column) {
              if (l.end.column == t.column && this.$insertRight) continue;
              l.end.column == t.column &&
                o > 0 &&
                a < f - 1 &&
                l.end.column > l.start.column &&
                l.end.column == u[a + 1].start.column &&
                (l.end.column -= o),
                (l.end.column += o),
                (l.end.row += s);
            }
          }
          if (s != 0 && a < f)
            for (; a < f; a++) {
              var l = u[a];
              (l.start.row += s), (l.end.row += s);
            }
        });
    }.call(s.prototype),
      (t.RangeList = s));
  }),

}
