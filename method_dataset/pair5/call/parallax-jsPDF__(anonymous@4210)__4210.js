function __method_wrapper__() {
  define("ace/mode/behaviour", ["require", "exports", "module"], function(
    e,
    t,
    n
  ) {
    "use strict";
    var r = function() {
      this.$behaviours = {};
    };
    (function() {
      (this.add = function(e, t, n) {
        switch (undefined) {
          case this.$behaviours:
            this.$behaviours = {};
          case this.$behaviours[e]:
            this.$behaviours[e] = {};
        }
        this.$behaviours[e][t] = n;
      }),
        (this.addBehaviours = function(e) {
          for (var t in e) for (var n in e[t]) this.add(t, n, e[t][n]);
        }),
        (this.remove = function(e) {
          this.$behaviours && this.$behaviours[e] && delete this.$behaviours[e];
        }),
        (this.inherit = function(e, t) {
          if (typeof e == "function") var n = new e().getBehaviours(t);
          else var n = e.getBehaviours(t);
          this.addBehaviours(n);
        }),
        (this.getBehaviours = function(e) {
          if (!e) return this.$behaviours;
          var t = {};
          for (var n = 0; n < e.length; n++)
            this.$behaviours[e[n]] && (t[e[n]] = this.$behaviours[e[n]]);
          return t;
        });
    }.call(r.prototype),
      (t.Behaviour = r));
  }),

}
