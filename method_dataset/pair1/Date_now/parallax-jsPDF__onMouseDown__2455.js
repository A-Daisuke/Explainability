function __method_wrapper__() {
        (this.onMouseDown = function(e) {
          if (!this.$dragEnabled) return;
          this.mousedownEvent = e;
          var t = this.editor,
            n = e.inSelection(),
            r = e.getButton(),
            i = e.domEvent.detail || 1;
          if (i === 1 && r === 0 && n) {
            if (
              e.editor.inMultiSelectMode &&
              (e.getAccelKey() || e.getShiftKey())
            )
              return;
            this.mousedownEvent.time = Date.now();
            var o = e.domEvent.target || e.domEvent.srcElement;
            "unselectable" in o && (o.unselectable = "on");
            if (t.getDragDelay()) {
              if (s.isWebKit) {
                this.cancelDrag = !0;
                var u = t.container;
                u.draggable = !0;
              }
              this.setState("dragWait");
            } else this.startDrag();
            this.captureMouse(e, this.onMouseDrag.bind(this)),
              (e.defaultPrevented = !0);
          }
        });

}
