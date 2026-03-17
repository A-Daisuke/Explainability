function __method_wrapper__() {
        (this.onMessage = function(e) {
          var t = e.data;
          switch (t.type) {
            case "event":
              this._signal(t.name, { data: t.data });
              break;
            case "call":
              var n = this.callbacks[t.id];
              n && (n(t.data), delete this.callbacks[t.id]);
              break;
            case "error":
              this.reportError(t.data);
              break;
            case "log":
              window.console &&
                console.log &&
                console.log.apply(console, t.data);
          }
        }),

}
