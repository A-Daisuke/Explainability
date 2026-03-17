function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("./lib/oop"),
      i = e("./apply_delta").applyDelta,
      s = e("./lib/event_emitter").EventEmitter,
      o = e("./range").Range,
      u = e("./anchor").Anchor,
      a = function(e) {
        (this.$lines = [""]),
          e.length === 0
            ? (this.$lines = [""])
            : Array.isArray(e)
            ? this.insertMergedLines({ row: 0, column: 0 }, e)
            : this.insert({ row: 0, column: 0 }, e);
      };
    (function() {
      r.implement(this, s),
        (this.setValue = function(e) {
          var t = this.getLength() - 1;
          this.remove(new o(0, 0, t, this.getLine(t).length)),
            this.insert({ row: 0, column: 0 }, e);
        }),
        (this.getValue = function() {
          return this.getAllLines().join(this.getNewLineCharacter());
        }),
        (this.createAnchor = function(e, t) {
          return new u(this, e, t);
        }),
        "aaa".split(/a/).length === 0
          ? (this.$split = function(e) {
              return e.replace(/\r\n|\r/g, "\n").split("\n");
            })
          : (this.$split = function(e) {
              return e.split(/\r\n|\r|\n/);
            }),
        (this.$detectNewLine = function(e) {
          var t = e.match(/^.*?(\r\n|\r|\n)/m);
          (this.$autoNewLine = t ? t[1] : "\n"),
            this._signal("changeNewLineMode");
        }),
        (this.getNewLineCharacter = function() {
          switch (this.$newLineMode) {
            case "windows":
              return "\r\n";
            case "unix":
              return "\n";
            default:
              return this.$autoNewLine || "\n";
          }
        }),
        (this.$autoNewLine = ""),
        (this.$newLineMode = "auto"),
        (this.setNewLineMode = function(e) {
          if (this.$newLineMode === e) return;
          (this.$newLineMode = e), this._signal("changeNewLineMode");
        }),
        (this.getNewLineMode = function() {
          return this.$newLineMode;
        }),
        (this.isNewLine = function(e) {
          return e == "\r\n" || e == "\r" || e == "\n";
        }),
        (this.getLine = function(e) {
          return this.$lines[e] || "";
        }),
        (this.getLines = function(e, t) {
          return this.$lines.slice(e, t + 1);
        }),
        (this.getAllLines = function() {
          return this.getLines(0, this.getLength());
        }),
        (this.getLength = function() {
          return this.$lines.length;
        }),
        (this.getTextRange = function(e) {
          return this.getLinesForRange(e).join(this.getNewLineCharacter());
        }),
        (this.getLinesForRange = function(e) {
          var t;
          if (e.start.row === e.end.row)
            t = [
              this.getLine(e.start.row).substring(e.start.column, e.end.column)
            ];
          else {
            (t = this.getLines(e.start.row, e.end.row)),
              (t[0] = (t[0] || "").substring(e.start.column));
            var n = t.length - 1;
            e.end.row - e.start.row == n &&
              (t[n] = t[n].substring(0, e.end.column));
          }
          return t;
        }),
        (this.insertLines = function(e, t) {
          return (
            console.warn(
              "Use of document.insertLines is deprecated. Use the insertFullLines method instead."
            ),
            this.insertFullLines(e, t)
          );
        }),
        (this.removeLines = function(e, t) {
          return (
            console.warn(
              "Use of document.removeLines is deprecated. Use the removeFullLines method instead."
            ),
            this.removeFullLines(e, t)
          );
        }),
        (this.insertNewLine = function(e) {
          return (
            console.warn(
              "Use of document.insertNewLine is deprecated. Use insertMergedLines(position, ['', '']) instead."
            ),
            this.insertMergedLines(e, ["", ""])
          );
        }),
        (this.insert = function(e, t) {
          return (
            this.getLength() <= 1 && this.$detectNewLine(t),
            this.insertMergedLines(e, this.$split(t))
          );
        }),
        (this.insertInLine = function(e, t) {
          var n = this.clippedPos(e.row, e.column),
            r = this.pos(e.row, e.column + t.length);
          return (
            this.applyDelta(
              { start: n, end: r, action: "insert", lines: [t] },
              !0
            ),
            this.clonePos(r)
          );
        }),
        (this.clippedPos = function(e, t) {
          var n = this.getLength();
          e === undefined
            ? (e = n)
            : e < 0
            ? (e = 0)
            : e >= n && ((e = n - 1), (t = undefined));
          var r = this.getLine(e);
          return (
            t == undefined && (t = r.length),
            (t = Math.min(Math.max(t, 0), r.length)),
            { row: e, column: t }
          );
        }),
        (this.clonePos = function(e) {
          return { row: e.row, column: e.column };
        }),
        (this.pos = function(e, t) {
          return { row: e, column: t };
        }),
        (this.$clipPosition = function(e) {
          var t = this.getLength();
          return (
            e.row >= t
              ? ((e.row = Math.max(0, t - 1)),
                (e.column = this.getLine(t - 1).length))
              : ((e.row = Math.max(0, e.row)),
                (e.column = Math.min(
                  Math.max(e.column, 0),
                  this.getLine(e.row).length
                ))),
            e
          );
        }),
        (this.insertFullLines = function(e, t) {
          e = Math.min(Math.max(e, 0), this.getLength());
          var n = 0;
          e < this.getLength()
            ? ((t = t.concat([""])), (n = 0))
            : ((t = [""].concat(t)), e--, (n = this.$lines[e].length)),
            this.insertMergedLines({ row: e, column: n }, t);
        }),
        (this.insertMergedLines = function(e, t) {
          var n = this.clippedPos(e.row, e.column),
            r = {
              row: n.row + t.length - 1,
              column: (t.length == 1 ? n.column : 0) + t[t.length - 1].length
            };
          return (
            this.applyDelta({ start: n, end: r, action: "insert", lines: t }),
            this.clonePos(r)
          );
        }),
        (this.remove = function(e) {
          var t = this.clippedPos(e.start.row, e.start.column),
            n = this.clippedPos(e.end.row, e.end.column);
          return (
            this.applyDelta({
              start: t,
              end: n,
              action: "remove",
              lines: this.getLinesForRange({ start: t, end: n })
            }),
            this.clonePos(t)
          );
        }),
        (this.removeInLine = function(e, t, n) {
          var r = this.clippedPos(e, t),
            i = this.clippedPos(e, n);
          return (
            this.applyDelta(
              {
                start: r,
                end: i,
                action: "remove",
                lines: this.getLinesForRange({ start: r, end: i })
              },
              !0
            ),
            this.clonePos(r)
          );
        }),
        (this.removeFullLines = function(e, t) {
          (e = Math.min(Math.max(0, e), this.getLength() - 1)),
            (t = Math.min(Math.max(0, t), this.getLength() - 1));
          var n = t == this.getLength() - 1 && e > 0,
            r = t < this.getLength() - 1,
            i = n ? e - 1 : e,
            s = n ? this.getLine(i).length : 0,
            u = r ? t + 1 : t,
            a = r ? 0 : this.getLine(u).length,
            f = new o(i, s, u, a),
            l = this.$lines.slice(e, t + 1);
          return (
            this.applyDelta({
              start: f.start,
              end: f.end,
              action: "remove",
              lines: this.getLinesForRange(f)
            }),
            l
          );
        }),
        (this.removeNewLine = function(e) {
          e < this.getLength() - 1 &&
            e >= 0 &&
            this.applyDelta({
              start: this.pos(e, this.getLine(e).length),
              end: this.pos(e + 1, 0),
              action: "remove",
              lines: ["", ""]
            });
        }),
        (this.replace = function(e, t) {
          e instanceof o || (e = o.fromPoints(e.start, e.end));
          if (t.length === 0 && e.isEmpty()) return e.start;
          if (t == this.getTextRange(e)) return e.end;
          this.remove(e);
          var n;
          return t ? (n = this.insert(e.start, t)) : (n = e.start), n;
        }),
        (this.applyDeltas = function(e) {
          for (var t = 0; t < e.length; t++) this.applyDelta(e[t]);
        }),
        (this.revertDeltas = function(e) {
          for (var t = e.length - 1; t >= 0; t--) this.revertDelta(e[t]);
        }),
        (this.applyDelta = function(e, t) {
          var n = e.action == "insert";
          if (
            n
              ? e.lines.length <= 1 && !e.lines[0]
              : !o.comparePoints(e.start, e.end)
          )
            return;
          n && e.lines.length > 2e4 && this.$splitAndapplyLargeDelta(e, 2e4),
            i(this.$lines, e, t),
            this._signal("change", e);
        }),
        (this.$splitAndapplyLargeDelta = function(e, t) {
          var n = e.lines,
            r = n.length,
            i = e.start.row,
            s = e.start.column,
            o = 0,
            u = 0;
          do {
            (o = u), (u += t - 1);
            var a = n.slice(o, u);
            if (u > r) {
              (e.lines = a), (e.start.row = i + o), (e.start.column = s);
              break;
            }
            a.push(""),
              this.applyDelta(
                {
                  start: this.pos(i + o, s),
                  end: this.pos(i + u, (s = 0)),
                  action: e.action,
                  lines: a
                },
                !0
              );
          } while (!0);
        }),
        (this.revertDelta = function(e) {
          this.applyDelta({
            start: this.clonePos(e.start),
            end: this.clonePos(e.end),
            action: e.action == "insert" ? "remove" : "insert",
            lines: e.lines.slice()
          });
        }),
        (this.indexToPosition = function(e, t) {
          var n = this.$lines || this.getAllLines(),
            r = this.getNewLineCharacter().length;
          for (var i = t || 0, s = n.length; i < s; i++) {
            e -= n[i].length + r;
            if (e < 0) return { row: i, column: e + n[i].length + r };
          }
          return { row: s - 1, column: n[s - 1].length };
        }),
        (this.positionToIndex = function(e, t) {
          var n = this.$lines || this.getAllLines(),
            r = this.getNewLineCharacter().length,
            i = 0,
            s = Math.min(e.row, n.length);
          for (var o = t || 0; o < s; ++o) i += n[o].length + r;
          return i + e.column;
        });
    }.call(a.prototype),
      (t.Document = a));
  }),

}
