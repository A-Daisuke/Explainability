  var Rectangle = function(x, y, w, h) {
    Point.call(this, x, y);
    this.type = "rect";

    var _w = w || 0;
    Object.defineProperty(this, "w", {
      enumerable: true,
      get: function() {
        return _w;
      },
      set: function(value) {
        if (!isNaN(value)) {
          _w = parseFloat(value);
        }
      }
    });

    var _h = h || 0;
    Object.defineProperty(this, "h", {
      enumerable: true,
      get: function() {
        return _h;
      },
      set: function(value) {
        if (!isNaN(value)) {
          _h = parseFloat(value);
        }
      }
    });

    return this;
  };
