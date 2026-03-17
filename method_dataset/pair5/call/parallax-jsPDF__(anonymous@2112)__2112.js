function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("../lib/event"),
      i = e("../lib/useragent"),
      s = (t.MouseEvent = function(e, t) {
        (this.domEvent = e),
          (this.editor = t),
          (this.x = this.clientX = e.clientX),
          (this.y = this.clientY = e.clientY),
          (this.$pos = null),
          (this.$inSelection = null),
          (this.propagationStopped = !1),
          (this.defaultPrevented = !1);
      });
    (function() {
      (this.stopPropagation = function() {
        r.stopPropagation(this.domEvent), (this.propagationStopped = !0);
      }),
        (this.preventDefault = function() {
          r.preventDefault(this.domEvent), (this.defaultPrevented = !0);
        }),
        (this.stop = function() {
          this.stopPropagation(), this.preventDefault();
        }),
        (this.getDocumentPosition = function() {
          return this.$pos
            ? this.$pos
            : ((this.$pos = this.editor.renderer.screenToTextCoordinates(
                this.clientX,
                this.clientY
              )),
              this.$pos);
        }),
        (this.inSelection = function() {
          if (this.$inSelection !== null) return this.$inSelection;
          var e = this.editor,
            t = e.getSelectionRange();
          if (t.isEmpty()) this.$inSelection = !1;
          else {
            var n = this.getDocumentPosition();
            this.$inSelection = t.contains(n.row, n.column);
          }
          return this.$inSelection;
        }),
        (this.getButton = function() {
          return r.getButton(this.domEvent);
        }),
        (this.getShiftKey = function() {
          return this.domEvent.shiftKey;
        }),
        (this.getAccelKey = i.isMac
          ? function() {
              return this.domEvent.metaKey;
            }
          : function() {
              return this.domEvent.ctrlKey;
            });
    }.call(s.prototype));
  }),

}
