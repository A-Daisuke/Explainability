function __method_wrapper__() {
        (this.$delegator = function(e, t, n) {
          var r = t[0];
          typeof r != "string" && (r = r[0]);
          for (var i = 0; i < this.$embeds.length; i++) {
            if (!this.$modes[this.$embeds[i]]) continue;
            var s = r.split(this.$embeds[i]);
            if (!s[0] && s[1]) {
              t[0] = s[1];
              var o = this.$modes[this.$embeds[i]];
              return o[e].apply(o, t);
            }
          }
          var u = n.apply(this, t);
          return n ? u : undefined;
        }),

}
