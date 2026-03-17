    function j(e) {
      var t, n, r;
      if (B(e)) return e;
      n = e.valueOf;
      if (typeof n == "function") {
        t = n.call(e);
        if (B(t)) return t;
      }
      r = e.toString;
      if (typeof r == "function") {
        t = r.call(e);
        if (B(t)) return t;
      }
      throw new TypeError();
    }
