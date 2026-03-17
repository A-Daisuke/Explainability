function __method_wrapper__() {
        (this.$historyTracker = function(e) {
          if (!this.$mergeUndoDeltas) return;
          var t = this.prevOp,
            n = this.$mergeableCommands,
            r = t.command && e.command.name == t.command.name;
          if (e.command.name == "insertstring") {
            var i = e.args;
            this.mergeNextCommand === undefined && (this.mergeNextCommand = !0),
              (r =
                r &&
                this.mergeNextCommand &&
                (!/\s/.test(i) || /\s/.test(t.args))),
              (this.mergeNextCommand = !0);
          } else r = r && n.indexOf(e.command.name) !== -1;
          this.$mergeUndoDeltas != "always" &&
            Date.now() - this.sequenceStartTime > 2e3 &&
            (r = !1),
            r
              ? (this.session.mergeUndoDeltas = !0)
              : n.indexOf(e.command.name) !== -1 &&
                (this.sequenceStartTime = Date.now());
        }),

}
