function __method_wrapper__() {
        Array.prototype.splice = function(e, t) {
          var n = this.length;
          e > 0
            ? e > n && (e = n)
            : e == void 0
            ? (e = 0)
            : e < 0 && (e = Math.max(n + e, 0)),
            e + t < n || (t = n - e);
          var r = this.slice(e, e + t),
            i = u.call(arguments, 2),
            s = i.length;
          if (e === n) s && this.push.apply(this, i);
          else {
            var o = Math.min(t, n - e),
              a = e + o,
              f = a + s - o,
              l = n - a,
              c = n - o;
            if (f < a) for (var h = 0; h < l; ++h) this[f + h] = this[a + h];
            else if (f > a) for (h = l; h--; ) this[f + h] = this[a + h];
            if (s && e === c) (this.length = c), this.push.apply(this, i);
            else {
              this.length = c + s;
              for (h = 0; h < s; ++h) this[e + h] = i[h];
            }
          }
          return r;
        };

}
