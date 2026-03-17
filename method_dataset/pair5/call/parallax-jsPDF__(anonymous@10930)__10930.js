class __C__ {
  define("ace/undomanager", ["require", "exports", "module"], function(
    e,
    t,
    n
  ) {
    "use strict";
    var r = function() {
      this.reset();
    };
    (function() {
      function e(e) {
        return {
          action: e.action,
          start: e.start,
          end: e.end,
          lines: e.lines.length == 1 ? null : e.lines,
          text: e.lines.length == 1 ? e.lines[0] : null
        };
      }
      function t(e) {
        return {
          action: e.action,
          start: e.start,
          end: e.end,
          lines: e.lines || [e.text]
        };
      }
      function n(e, t) {
        var n = new Array(e.length);
        for (var r = 0; r < e.length; r++) {
          var i = e[r],
            s = { group: i.group, deltas: new Array(i.length) };
          for (var o = 0; o < i.deltas.length; o++) {
            var u = i.deltas[o];
            s.deltas[o] = t(u);
          }
          n[r] = s;
        }
        return n;
      }
      (this.execute = function(e) {
        var t = e.args[0];
        (this.$doc = e.args[1]),
          e.merge &&
            this.hasUndo() &&
            (this.dirtyCounter--, (t = this.$undoStack.pop().concat(t))),
          this.$undoStack.push(t),
          (this.$redoStack = []),
          this.dirtyCounter < 0 && (this.dirtyCounter = NaN),
          this.dirtyCounter++;
      }),
        (this.undo = function(e) {
          var t = this.$undoStack.pop(),
            n = null;
          return (
            t &&
              ((n = this.$doc.undoChanges(t, e)),
              this.$redoStack.push(t),
              this.dirtyCounter--),
            n
          );
        }),
        (this.redo = function(e) {
          var t = this.$redoStack.pop(),
            n = null;
          return (
            t &&
              ((n = this.$doc.redoChanges(this.$deserializeDeltas(t), e)),
              this.$undoStack.push(t),
              this.dirtyCounter++),
            n
          );
        }),
        (this.reset = function() {
          (this.$undoStack = []),
            (this.$redoStack = []),
            (this.dirtyCounter = 0);
        }),
        (this.hasUndo = function() {
          return this.$undoStack.length > 0;
        }),
        (this.hasRedo = function() {
          return this.$redoStack.length > 0;
        }),
        (this.markClean = function() {
          this.dirtyCounter = 0;
        }),
        (this.isClean = function() {
          return this.dirtyCounter === 0;
        }),
        (this.$serializeDeltas = function(t) {
          return n(t, e);
        }),
        (this.$deserializeDeltas = function(e) {
          return n(e, t);
        });
    }.call(r.prototype),
      (t.UndoManager = r));
  }),

}
