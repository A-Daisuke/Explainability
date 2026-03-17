function __method_wrapper__() {
  ], function(e, t, n) {
    "use strict";
    var r = e("./lib/event"),
      i = function(e, t) {
        (this.onRender = e),
          (this.pending = !1),
          (this.changes = 0),
          (this.window = t || window);
      };
    (function() {
      this.schedule = function(e) {
        this.changes = this.changes | e;
        if (!this.pending && this.changes) {
          this.pending = !0;
          var t = this;
          r.nextFrame(function() {
            t.pending = !1;
            var e;
            while ((e = t.changes)) (t.changes = 0), t.onRender(e);
          }, this.window);
        }
      };
    }.call(i.prototype),
      (t.RenderLoop = i));
  }),

}
