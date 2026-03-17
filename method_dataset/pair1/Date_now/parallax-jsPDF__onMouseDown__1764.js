function __method_wrapper__() {
      (this.onMouseDown = function(e) {
        var t = e.inSelection(),
          n = e.getDocumentPosition();
        this.mousedownEvent = e;
        var r = this.editor,
          i = e.getButton();
        if (i !== 0) {
          var s = r.getSelectionRange(),
            o = s.isEmpty();
          r.$blockScrolling++,
            (o || i == 1) && r.selection.moveToPosition(n),
            r.$blockScrolling--,
            i == 2 && r.textInput.onContextMenu(e.domEvent);
          return;
        }
        this.mousedownEvent.time = Date.now();
        if (t && !r.isFocused()) {
          r.focus();
          if (
            this.$focusTimout &&
            !this.$clickSelection &&
            !r.inMultiSelectMode
          ) {
            this.setState("focusWait"), this.captureMouse(e);
            return;
          }
        }
        return (
          this.captureMouse(e),
          this.startSelect(n, e.domEvent._clicks > 1),
          e.preventDefault()
        );
      }),

}
