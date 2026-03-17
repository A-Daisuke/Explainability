function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("./lib/lang"),
      i = e("./lib/oop"),
      s = e("./range").Range,
      o = function() {
        this.$options = {};
      };
    (function() {
      (this.set = function(e) {
        return i.mixin(this.$options, e), this;
      }),
        (this.getOptions = function() {
          return r.copyObject(this.$options);
        }),
        (this.setOptions = function(e) {
          this.$options = e;
        }),
        (this.find = function(e) {
          var t = this.$options,
            n = this.$matchIterator(e, t);
          if (!n) return !1;
          var r = null;
          return (
            n.forEach(function(e, n, i) {
              if (!e.start) {
                var o = e.offset + (i || 0);
                r = new s(n, o, n, o + e.length);
                if (
                  !e.length &&
                  t.start &&
                  t.start.start &&
                  t.skipCurrent != 0 &&
                  r.isEqual(t.start)
                )
                  return (r = null), !1;
              } else r = e;
              return !0;
            }),
            r
          );
        }),
        (this.findAll = function(e) {
          var t = this.$options;
          if (!t.needle) return [];
          this.$assembleRegExp(t);
          var n = t.range,
            i = n ? e.getLines(n.start.row, n.end.row) : e.doc.getAllLines(),
            o = [],
            u = t.re;
          if (t.$isMultiLine) {
            var a = u.length,
              f = i.length - a,
              l;
            e: for (var c = u.offset || 0; c <= f; c++) {
              for (var h = 0; h < a; h++)
                if (i[c + h].search(u[h]) == -1) continue e;
              var p = i[c],
                d = i[c + a - 1],
                v = p.length - p.match(u[0])[0].length,
                m = d.match(u[a - 1])[0].length;
              if (l && l.end.row === c && l.end.column > v) continue;
              o.push((l = new s(c, v, c + a - 1, m))), a > 2 && (c = c + a - 2);
            }
          } else
            for (var g = 0; g < i.length; g++) {
              var y = r.getMatchOffsets(i[g], u);
              for (var h = 0; h < y.length; h++) {
                var b = y[h];
                o.push(new s(g, b.offset, g, b.offset + b.length));
              }
            }
          if (n) {
            var w = n.start.column,
              E = n.start.column,
              g = 0,
              h = o.length - 1;
            while (
              g < h &&
              o[g].start.column < w &&
              o[g].start.row == n.start.row
            )
              g++;
            while (g < h && o[h].end.column > E && o[h].end.row == n.end.row)
              h--;
            o = o.slice(g, h + 1);
            for (g = 0, h = o.length; g < h; g++)
              (o[g].start.row += n.start.row), (o[g].end.row += n.start.row);
          }
          return o;
        }),
        (this.replace = function(e, t) {
          var n = this.$options,
            r = this.$assembleRegExp(n);
          if (n.$isMultiLine) return t;
          if (!r) return;
          var i = r.exec(e);
          if (!i || i[0].length != e.length) return null;
          t = e.replace(r, t);
          if (n.preserveCase) {
            t = t.split("");
            for (var s = Math.min(e.length, e.length); s--; ) {
              var o = e[s];
              o && o.toLowerCase() != o
                ? (t[s] = t[s].toUpperCase())
                : (t[s] = t[s].toLowerCase());
            }
            t = t.join("");
          }
          return t;
        }),
        (this.$matchIterator = function(e, t) {
          var n = this.$assembleRegExp(t);
          if (!n) return !1;
          var i;
          if (t.$isMultiLine)
            var o = n.length,
              u = function(t, r, u) {
                var a = t.search(n[0]);
                if (a == -1) return;
                for (var f = 1; f < o; f++) {
                  t = e.getLine(r + f);
                  if (t.search(n[f]) == -1) return;
                }
                var l = t.match(n[o - 1])[0].length,
                  c = new s(r, a, r + o - 1, l);
                n.offset == 1
                  ? (c.start.row--, (c.start.column = Number.MAX_VALUE))
                  : u && (c.start.column += u);
                if (i(c)) return !0;
              };
          else if (t.backwards)
            var u = function(e, t, s) {
              var o = r.getMatchOffsets(e, n);
              for (var u = o.length - 1; u >= 0; u--)
                if (i(o[u], t, s)) return !0;
            };
          else
            var u = function(e, t, s) {
              var o = r.getMatchOffsets(e, n);
              for (var u = 0; u < o.length; u++) if (i(o[u], t, s)) return !0;
            };
          var a = this.$lineIterator(e, t);
          return {
            forEach: function(e) {
              (i = e), a.forEach(u);
            }
          };
        }),
        (this.$assembleRegExp = function(e, t) {
          if (e.needle instanceof RegExp) return (e.re = e.needle);
          var n = e.needle;
          if (!e.needle) return (e.re = !1);
          e.regExp || (n = r.escapeRegExp(n)),
            e.wholeWord && (n = "\\b" + n + "\\b");
          var i = e.caseSensitive ? "gm" : "gmi";
          e.$isMultiLine = !t && /[\n\r]/.test(n);
          if (e.$isMultiLine)
            return (e.re = this.$assembleMultilineRegExp(n, i));
          try {
            var s = new RegExp(n, i);
          } catch (o) {
            s = !1;
          }
          return (e.re = s);
        }),
        (this.$assembleMultilineRegExp = function(e, t) {
          var n = e.replace(/\r\n|\r|\n/g, "$\n^").split("\n"),
            r = [];
          for (var i = 0; i < n.length; i++)
            try {
              r.push(new RegExp(n[i], t));
            } catch (s) {
              return !1;
            }
          return n[0] == "" ? (r.shift(), (r.offset = 1)) : (r.offset = 0), r;
        }),
        (this.$lineIterator = function(e, t) {
          var n = t.backwards == 1,
            r = t.skipCurrent != 0,
            i = t.range,
            s = t.start;
          s || (s = i ? i[n ? "end" : "start"] : e.selection.getRange()),
            s.start && (s = s[r != n ? "end" : "start"]);
          var o = i ? i.start.row : 0,
            u = i ? i.end.row : e.getLength() - 1,
            a = n
              ? function(n) {
                  var r = s.row,
                    i = e.getLine(r).substring(0, s.column);
                  if (n(i, r)) return;
                  for (r--; r >= o; r--) if (n(e.getLine(r), r)) return;
                  if (t.wrap == 0) return;
                  for (r = u, o = s.row; r >= o; r--)
                    if (n(e.getLine(r), r)) return;
                }
              : function(n) {
                  var r = s.row,
                    i = e.getLine(r).substr(s.column);
                  if (n(i, r, s.column)) return;
                  for (r += 1; r <= u; r++) if (n(e.getLine(r), r)) return;
                  if (t.wrap == 0) return;
                  for (r = o, u = s.row; r <= u; r++)
                    if (n(e.getLine(r), r)) return;
                };
          return { forEach: a };
        });
    }.call(o.prototype),
      (t.Search = o));
  }),

}
