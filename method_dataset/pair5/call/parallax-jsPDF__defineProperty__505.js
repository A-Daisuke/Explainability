function __method_wrapper__() {
      Object.defineProperty = function(t, n, r) {
        if ((typeof t != "object" && typeof t != "function") || t === null)
          throw new TypeError(N + t);
        if ((typeof r != "object" && typeof r != "function") || r === null)
          throw new TypeError(T + r);
        if (x)
          try {
            return x.call(Object, t, n, r);
          } catch (i) {}
        if (f(r, "value"))
          if (d && (h(t, n) || p(t, n))) {
            var s = t.__proto__;
            (t.__proto__ = o), delete t[n], (t[n] = r.value), (t.__proto__ = s);
          } else t[n] = r.value;
        else {
          if (!d) throw new TypeError(C);
          f(r, "get") && l(t, n, r.get), f(r, "set") && c(t, n, r.set);
        }
        return t;
      };

}
