function __method_wrapper__() {
        (this.embedRules = function(e, t, n, i, s) {
          var o = typeof e == "function" ? new e().getRules() : e;
          if (i) for (var u = 0; u < i.length; u++) i[u] = t + i[u];
          else {
            i = [];
            for (var a in o) i.push(t + a);
          }
          this.addRules(o, t);
          if (n) {
            var f = Array.prototype[s ? "push" : "unshift"];
            for (var u = 0; u < i.length; u++)
              f.apply(this.$rules[i[u]], r.deepCopy(n));
          }
          this.$embeds || (this.$embeds = []), this.$embeds.push(t);
        }),

}
