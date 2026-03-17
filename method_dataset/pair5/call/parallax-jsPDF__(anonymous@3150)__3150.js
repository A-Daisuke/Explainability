class __C__ {
  define("ace/range", ["require", "exports", "module"], function(e, t, n) {
    "use strict";
    var r = function(e, t) {
        return e.row - t.row || e.column - t.column;
      },
      i = function(e, t, n, r) {
        (this.start = { row: e, column: t }),
          (this.end = { row: n, column: r });
      };
    (function() {
      (this.isEqual = function(e) {
        return (
          this.start.row === e.start.row &&
          this.end.row === e.end.row &&
          this.start.column === e.start.column &&
          this.end.column === e.end.column
        );
      }),
        (this.toString = function() {
          return (
            "Range: [" +
            this.start.row +
            "/" +
            this.start.column +
            "] -> [" +
            this.end.row +
            "/" +
            this.end.column +
            "]"
          );
        }),
        (this.contains = function(e, t) {
          return this.compare(e, t) == 0;
        }),
        (this.compareRange = function(e) {
          var t,
            n = e.end,
            r = e.start;
          return (
            (t = this.compare(n.row, n.column)),
            t == 1
              ? ((t = this.compare(r.row, r.column)),
                t == 1 ? 2 : t == 0 ? 1 : 0)
              : t == -1
              ? -2
              : ((t = this.compare(r.row, r.column)),
                t == -1 ? -1 : t == 1 ? 42 : 0)
          );
        }),
        (this.comparePoint = function(e) {
          return this.compare(e.row, e.column);
        }),
        (this.containsRange = function(e) {
          return (
            this.comparePoint(e.start) == 0 && this.comparePoint(e.end) == 0
          );
        }),
        (this.intersects = function(e) {
          var t = this.compareRange(e);
          return t == -1 || t == 0 || t == 1;
        }),
        (this.isEnd = function(e, t) {
          return this.end.row == e && this.end.column == t;
        }),
        (this.isStart = function(e, t) {
          return this.start.row == e && this.start.column == t;
        }),
        (this.setStart = function(e, t) {
          typeof e == "object"
            ? ((this.start.column = e.column), (this.start.row = e.row))
            : ((this.start.row = e), (this.start.column = t));
        }),
        (this.setEnd = function(e, t) {
          typeof e == "object"
            ? ((this.end.column = e.column), (this.end.row = e.row))
            : ((this.end.row = e), (this.end.column = t));
        }),
        (this.inside = function(e, t) {
          return this.compare(e, t) == 0
            ? this.isEnd(e, t) || this.isStart(e, t)
              ? !1
              : !0
            : !1;
        }),
        (this.insideStart = function(e, t) {
          return this.compare(e, t) == 0 ? (this.isEnd(e, t) ? !1 : !0) : !1;
        }),
        (this.insideEnd = function(e, t) {
          return this.compare(e, t) == 0 ? (this.isStart(e, t) ? !1 : !0) : !1;
        }),
        (this.compare = function(e, t) {
          return !this.isMultiLine() && e === this.start.row
            ? t < this.start.column
              ? -1
              : t > this.end.column
              ? 1
              : 0
            : e < this.start.row
            ? -1
            : e > this.end.row
            ? 1
            : this.start.row === e
            ? t >= this.start.column
              ? 0
              : -1
            : this.end.row === e
            ? t <= this.end.column
              ? 0
              : 1
            : 0;
        }),
        (this.compareStart = function(e, t) {
          return this.start.row == e && this.start.column == t
            ? -1
            : this.compare(e, t);
        }),
        (this.compareEnd = function(e, t) {
          return this.end.row == e && this.end.column == t
            ? 1
            : this.compare(e, t);
        }),
        (this.compareInside = function(e, t) {
          return this.end.row == e && this.end.column == t
            ? 1
            : this.start.row == e && this.start.column == t
            ? -1
            : this.compare(e, t);
        }),
        (this.clipRows = function(e, t) {
          if (this.end.row > t) var n = { row: t + 1, column: 0 };
          else if (this.end.row < e) var n = { row: e, column: 0 };
          if (this.start.row > t) var r = { row: t + 1, column: 0 };
          else if (this.start.row < e) var r = { row: e, column: 0 };
          return i.fromPoints(r || this.start, n || this.end);
        }),
        (this.extend = function(e, t) {
          var n = this.compare(e, t);
          if (n == 0) return this;
          if (n == -1) var r = { row: e, column: t };
          else var s = { row: e, column: t };
          return i.fromPoints(r || this.start, s || this.end);
        }),
        (this.isEmpty = function() {
          return (
            this.start.row === this.end.row &&
            this.start.column === this.end.column
          );
        }),
        (this.isMultiLine = function() {
          return this.start.row !== this.end.row;
        }),
        (this.clone = function() {
          return i.fromPoints(this.start, this.end);
        }),
        (this.collapseRows = function() {
          return this.end.column == 0
            ? new i(
                this.start.row,
                0,
                Math.max(this.start.row, this.end.row - 1),
                0
              )
            : new i(this.start.row, 0, this.end.row, 0);
        }),
        (this.toScreenRange = function(e) {
          var t = e.documentToScreenPosition(this.start),
            n = e.documentToScreenPosition(this.end);
          return new i(t.row, t.column, n.row, n.column);
        }),
        (this.moveBy = function(e, t) {
          (this.start.row += e),
            (this.start.column += t),
            (this.end.row += e),
            (this.end.column += t);
        });
    }.call(i.prototype),
      (i.fromPoints = function(e, t) {
        return new i(e.row, e.column, t.row, t.column);
      }),
      (i.comparePoints = r),
      (i.comparePoints = function(e, t) {
        return e.row - t.row || e.column - t.column;
      }),
      (t.Range = i));
  }),

}
