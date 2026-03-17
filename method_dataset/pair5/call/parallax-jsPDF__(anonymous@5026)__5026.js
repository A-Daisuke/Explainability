function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("./lib/oop"),
      i = e("./lib/event_emitter").EventEmitter,
      s = (t.Anchor = function(e, t, n) {
        (this.$onChange = this.onChange.bind(this)),
          this.attach(e),
          typeof n == "undefined"
            ? this.setPosition(t.row, t.column)
            : this.setPosition(t, n);
      });
    (function() {
      function e(e, t, n) {
        var r = n ? e.column <= t.column : e.column < t.column;
        return e.row < t.row || (e.row == t.row && r);
      }
      function t(t, n, r) {
        var i = t.action == "insert",
          s = (i ? 1 : -1) * (t.end.row - t.start.row),
          o = (i ? 1 : -1) * (t.end.column - t.start.column),
          u = t.start,
          a = i ? u : t.end;
        return e(n, u, r)
          ? { row: n.row, column: n.column }
          : e(a, n, !r)
          ? { row: n.row + s, column: n.column + (n.row == a.row ? o : 0) }
          : { row: u.row, column: u.column };
      }
      r.implement(this, i),
        (this.getPosition = function() {
          return this.$clipPositionToDocument(this.row, this.column);
        }),
        (this.getDocument = function() {
          return this.document;
        }),
        (this.$insertRight = !1),
        (this.onChange = function(e) {
          if (e.start.row == e.end.row && e.start.row != this.row) return;
          if (e.start.row > this.row) return;
          var n = t(
            e,
            { row: this.row, column: this.column },
            this.$insertRight
          );
          this.setPosition(n.row, n.column, !0);
        }),
        (this.setPosition = function(e, t, n) {
          var r;
          n
            ? (r = { row: e, column: t })
            : (r = this.$clipPositionToDocument(e, t));
          if (this.row == r.row && this.column == r.column) return;
          var i = { row: this.row, column: this.column };
          (this.row = r.row),
            (this.column = r.column),
            this._signal("change", { old: i, value: r });
        }),
        (this.detach = function() {
          this.document.removeEventListener("change", this.$onChange);
        }),
        (this.attach = function(e) {
          (this.document = e || this.document),
            this.document.on("change", this.$onChange);
        }),
        (this.$clipPositionToDocument = function(e, t) {
          var n = {};
          return (
            e >= this.document.getLength()
              ? ((n.row = Math.max(0, this.document.getLength() - 1)),
                (n.column = this.document.getLine(n.row).length))
              : e < 0
              ? ((n.row = 0), (n.column = 0))
              : ((n.row = e),
                (n.column = Math.min(
                  this.document.getLine(n.row).length,
                  Math.max(0, t)
                ))),
            t < 0 && (n.column = 0),
            n
          );
        });
    }.call(s.prototype));
  }),

}
