function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("./lib/oop"),
      i = e("./lib/event_emitter").EventEmitter,
      s = function(e, t) {
        (this.running = !1),
          (this.lines = []),
          (this.states = []),
          (this.currentLine = 0),
          (this.tokenizer = e);
        var n = this;
        this.$worker = function() {
          if (!n.running) return;
          var e = new Date(),
            t = n.currentLine,
            r = -1,
            i = n.doc,
            s = t;
          while (n.lines[t]) t++;
          var o = i.getLength(),
            u = 0;
          n.running = !1;
          while (t < o) {
            n.$tokenizeRow(t), (r = t);
            do t++;
            while (n.lines[t]);
            u++;
            if (u % 5 === 0 && new Date() - e > 20) {
              n.running = setTimeout(n.$worker, 20);
              break;
            }
          }
          (n.currentLine = t), s <= r && n.fireUpdateEvent(s, r);
        };
      };
    (function() {
      r.implement(this, i),
        (this.setTokenizer = function(e) {
          (this.tokenizer = e),
            (this.lines = []),
            (this.states = []),
            this.start(0);
        }),
        (this.setDocument = function(e) {
          (this.doc = e), (this.lines = []), (this.states = []), this.stop();
        }),
        (this.fireUpdateEvent = function(e, t) {
          var n = { first: e, last: t };
          this._signal("update", { data: n });
        }),
        (this.start = function(e) {
          (this.currentLine = Math.min(
            e || 0,
            this.currentLine,
            this.doc.getLength()
          )),
            this.lines.splice(this.currentLine, this.lines.length),
            this.states.splice(this.currentLine, this.states.length),
            this.stop(),
            (this.running = setTimeout(this.$worker, 700));
        }),
        (this.scheduleStart = function() {
          this.running || (this.running = setTimeout(this.$worker, 700));
        }),
        (this.$updateOnChange = function(e) {
          var t = e.start.row,
            n = e.end.row - t;
          if (n === 0) this.lines[t] = null;
          else if (e.action == "remove")
            this.lines.splice(t, n + 1, null),
              this.states.splice(t, n + 1, null);
          else {
            var r = Array(n + 1);
            r.unshift(t, 1),
              this.lines.splice.apply(this.lines, r),
              this.states.splice.apply(this.states, r);
          }
          (this.currentLine = Math.min(
            t,
            this.currentLine,
            this.doc.getLength()
          )),
            this.stop();
        }),
        (this.stop = function() {
          this.running && clearTimeout(this.running), (this.running = !1);
        }),
        (this.getTokens = function(e) {
          return this.lines[e] || this.$tokenizeRow(e);
        }),
        (this.getState = function(e) {
          return (
            this.currentLine == e && this.$tokenizeRow(e),
            this.states[e] || "start"
          );
        }),
        (this.$tokenizeRow = function(e) {
          var t = this.doc.getLine(e),
            n = this.states[e - 1],
            r = this.tokenizer.getLineTokens(t, n, e);
          return (
            this.states[e] + "" != r.state + ""
              ? ((this.states[e] = r.state),
                (this.lines[e + 1] = null),
                this.currentLine > e + 1 && (this.currentLine = e + 1))
              : this.currentLine == e && (this.currentLine = e + 1),
            (this.lines[e] = r.tokens)
          );
        });
    }.call(s.prototype),
      (t.BackgroundTokenizer = s));
  }),

}
