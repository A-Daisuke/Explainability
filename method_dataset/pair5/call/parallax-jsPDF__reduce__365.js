function __method_wrapper__() {
        (Array.prototype.reduce = function(t) {
          var n = F(this),
            r = g && a(this) == "[object String]" ? this.split("") : n,
            i = r.length >>> 0;
          if (a(t) != "[object Function]")
            throw new TypeError(t + " is not a function");
          if (!i && arguments.length == 1)
            throw new TypeError("reduce of empty array with no initial value");
          var s = 0,
            o;
          if (arguments.length >= 2) o = arguments[1];
          else
            do {
              if (s in r) {
                o = r[s++];
                break;
              }
              if (++s >= i)
                throw new TypeError(
                  "reduce of empty array with no initial value"
                );
            } while (!0);
          for (; s < i; s++) s in r && (o = t.call(void 0, o, r[s], s, n));
          return o;
        }),

}
