function __method_wrapper__() {
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

}
