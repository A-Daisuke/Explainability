function __method_wrapper__() {
  define("ace/token_iterator", ["require", "exports", "module"], function(
    e,
    t,
    n
  ) {
    "use strict";
    var r = function(e, t, n) {
      (this.$session = e), (this.$row = t), (this.$rowTokens = e.getTokens(t));
      var r = e.getTokenAt(t, n);
      this.$tokenIndex = r ? r.index : -1;
    };
    (function() {
      (this.stepBackward = function() {
        this.$tokenIndex -= 1;
        while (this.$tokenIndex < 0) {
          this.$row -= 1;
          if (this.$row < 0) return (this.$row = 0), null;
          (this.$rowTokens = this.$session.getTokens(this.$row)),
            (this.$tokenIndex = this.$rowTokens.length - 1);
        }
        return this.$rowTokens[this.$tokenIndex];
      }),
        (this.stepForward = function() {
          this.$tokenIndex += 1;
          var e;
          while (this.$tokenIndex >= this.$rowTokens.length) {
            (this.$row += 1), e || (e = this.$session.getLength());
            if (this.$row >= e) return (this.$row = e - 1), null;
            (this.$rowTokens = this.$session.getTokens(this.$row)),
              (this.$tokenIndex = 0);
          }
          return this.$rowTokens[this.$tokenIndex];
        }),
        (this.getCurrentToken = function() {
          return this.$rowTokens[this.$tokenIndex];
        }),
        (this.getCurrentTokenRow = function() {
          return this.$row;
        }),
        (this.getCurrentTokenColumn = function() {
          var e = this.$rowTokens,
            t = this.$tokenIndex,
            n = e[t].start;
          if (n !== undefined) return n;
          n = 0;
          while (t > 0) (t -= 1), (n += e[t].value.length);
          return n;
        }),
        (this.getCurrentTokenPosition = function() {
          return { row: this.$row, column: this.getCurrentTokenColumn() };
        });
    }.call(r.prototype),
      (t.TokenIterator = r));
  }),

}
