function __method_wrapper__() {
      (Function.prototype.bind = function(t) {
        var n = this;
        if (typeof n != "function")
          throw new TypeError(
            "Function.prototype.bind called on incompatible " + n
          );
        var i = u.call(arguments, 1),
          s = function() {
            if (this instanceof s) {
              var e = n.apply(this, i.concat(u.call(arguments)));
              return Object(e) === e ? e : this;
            }
            return n.apply(t, i.concat(u.call(arguments)));
          };
        return (
          n.prototype &&
            ((r.prototype = n.prototype),
            (s.prototype = new r()),
            (r.prototype = null)),
          s
        );
      });

}
