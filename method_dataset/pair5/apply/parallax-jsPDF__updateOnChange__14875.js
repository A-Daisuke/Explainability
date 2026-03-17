function __method_wrapper__() {
        (this.updateOnChange = function(e) {
          var t = this.session.lineWidgets;
          if (!t) return;
          var n = e.start.row,
            r = e.end.row - n;
          if (r !== 0)
            if (e.action == "remove") {
              var i = t.splice(n + 1, r);
              i.forEach(function(e) {
                e && this.removeLineWidget(e);
              }, this),
                this.$updateRows();
            } else {
              var s = new Array(r);
              s.unshift(n, 0), t.splice.apply(t, s), this.$updateRows();
            }
        }),

}
