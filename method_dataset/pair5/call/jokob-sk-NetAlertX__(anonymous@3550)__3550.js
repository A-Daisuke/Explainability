function __method_wrapper__() {
      emit: /* @__PURE__ */ __name(function(type) {
        var d = select_default2(this.that).datum();
        listeners.call(
          type,
          this.that,
          new ZoomEvent(type, {
            sourceEvent: this.sourceEvent,
            target: zoom,
            type,
            transform: this.that.__zoom,
            dispatch: listeners
          }),
          d
        );
      }, "emit")

}
