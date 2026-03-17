function __method_wrapper__() {
  ], function(e, t, n) {
    "no use strict";
    function o(e) {
      typeof console != "undefined" &&
        console.warn &&
        console.warn.apply(console, arguments);
    }
    function u(e, t) {
      var n = new Error(e);
      (n.data = t),
        typeof console == "object" && console.error && console.error(n),
        setTimeout(function() {
          throw n;
        });
    }
    var r = e("./oop"),
      i = e("./event_emitter").EventEmitter,
      s = {
        setOptions: function(e) {
          Object.keys(e).forEach(function(t) {
            this.setOption(t, e[t]);
          }, this);
        },
        getOptions: function(e) {
          var t = {};
          return (
            e
              ? Array.isArray(e) || ((t = e), (e = Object.keys(t)))
              : (e = Object.keys(this.$options)),
            e.forEach(function(e) {
              t[e] = this.getOption(e);
            }, this),
            t
          );
        },
        setOption: function(e, t) {
          if (this["$" + e] === t) return;
          var n = this.$options[e];
          if (!n) return o('misspelled option "' + e + '"');
          if (n.forwardTo)
            return this[n.forwardTo] && this[n.forwardTo].setOption(e, t);
          n.handlesSet || (this["$" + e] = t),
            n && n.set && n.set.call(this, t);
        },
        getOption: function(e) {
          var t = this.$options[e];
          return t
            ? t.forwardTo
              ? this[t.forwardTo] && this[t.forwardTo].getOption(e)
              : t && t.get
              ? t.get.call(this)
              : this["$" + e]
            : o('misspelled option "' + e + '"');
        }
      },
      a = function() {
        this.$defaultOptions = {};
      };
    (function() {
      r.implement(this, i),
        (this.defineOptions = function(e, t, n) {
          return (
            e.$options || (this.$defaultOptions[t] = e.$options = {}),
            Object.keys(n).forEach(function(t) {
              var r = n[t];
              typeof r == "string" && (r = { forwardTo: r }),
                r.name || (r.name = t),
                (e.$options[r.name] = r),
                "initialValue" in r && (e["$" + r.name] = r.initialValue);
            }),
            r.implement(e, s),
            this
          );
        }),
        (this.resetOptions = function(e) {
          Object.keys(e.$options).forEach(function(t) {
            var n = e.$options[t];
            "value" in n && e.setOption(t, n.value);
          });
        }),
        (this.setDefaultValue = function(e, t, n) {
          var r = this.$defaultOptions[e] || (this.$defaultOptions[e] = {});
          r[t] &&
            (r.forwardTo
              ? this.setDefaultValue(r.forwardTo, t, n)
              : (r[t].value = n));
        }),
        (this.setDefaultValues = function(e, t) {
          Object.keys(t).forEach(function(n) {
            this.setDefaultValue(e, n, t[n]);
          }, this);
        }),
        (this.warn = o),
        (this.reportError = u);
    }.call(a.prototype),
      (t.AppConfig = a));
  }),

}
