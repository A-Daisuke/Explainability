function __method_wrapper__() {
    (RegExp.prototype.exec = function(e) {
      var t = r.exec.apply(this, arguments),
        n,
        a;
      if (typeof e == "string" && t) {
        !i &&
          t.length > 1 &&
          u(t, "") > -1 &&
          ((a = RegExp(this.source, r.replace.call(o(this), "g", ""))),
          r.replace.call(e.slice(t.index), a, function() {
            for (var e = 1; e < arguments.length - 2; e++)
              arguments[e] === undefined && (t[e] = undefined);
          }));
        if (this._xregexp && this._xregexp.captureNames)
          for (var f = 1; f < t.length; f++)
            (n = this._xregexp.captureNames[f - 1]), n && (t[n] = t[f]);
        !s &&
          this.global &&
          !t[0].length &&
          this.lastIndex > t.index &&
          this.lastIndex--;
      }
      return t;
    }),

}
