  var Rectangle = function Rectangle(x, y, w, h) {
    Point.call(this, x, y);
    this.type = "rect";
    var _w = w || 0;
    Object.defineProperty(this, "w", {
      enumerable: true,
      get: function get() {
        return _w;
      },
      set: function set(value) {
        if (!isNaN(value)) {
          _w = parseFloat(value);
        }
      }
    });
    var _h = h || 0;
    Object.defineProperty(this, "h", {
      enumerable: true,
      get: function get() {
        return _h;
      },
      set: function set(value) {
        if (!isNaN(value)) {
          _h = parseFloat(value);
        }
      }
    });
    return this;
  };
