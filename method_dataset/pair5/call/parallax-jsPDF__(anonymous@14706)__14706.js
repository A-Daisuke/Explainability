function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("../../range").Range,
      i = (t.FoldMode = function() {});
    (function() {
      (this.foldingStartMarker = null),
        (this.foldingStopMarker = null),
        (this.getFoldWidget = function(e, t, n) {
          var r = e.getLine(n);
          return this.foldingStartMarker.test(r)
            ? "start"
            : t == "markbeginend" &&
              this.foldingStopMarker &&
              this.foldingStopMarker.test(r)
            ? "end"
            : "";
        }),
        (this.getFoldWidgetRange = function(e, t, n) {
          return null;
        }),
        (this.indentationBlock = function(e, t, n) {
          var i = /\S/,
            s = e.getLine(t),
            o = s.search(i);
          if (o == -1) return;
          var u = n || s.length,
            a = e.getLength(),
            f = t,
            l = t;
          while (++t < a) {
            var c = e.getLine(t).search(i);
            if (c == -1) continue;
            if (c <= o) break;
            l = t;
          }
          if (l > f) {
            var h = e.getLine(l).length;
            return new r(f, u, l, h);
          }
        }),
        (this.openingBracketBlock = function(e, t, n, i, s) {
          var o = { row: n, column: i + 1 },
            u = e.$findClosingBracket(t, o, s);
          if (!u) return;
          var a = e.foldWidgets[u.row];
          return (
            a == null && (a = e.getFoldWidget(u.row)),
            a == "start" &&
              u.row > o.row &&
              (u.row--, (u.column = e.getLine(u.row).length)),
            r.fromPoints(o, u)
          );
        }),
        (this.closingBracketBlock = function(e, t, n, i, s) {
          var o = { row: n, column: i },
            u = e.$findOpeningBracket(t, o);
          if (!u) return;
          return u.column++, o.column--, r.fromPoints(u, o);
        });
    }.call(i.prototype));
  }),

}
