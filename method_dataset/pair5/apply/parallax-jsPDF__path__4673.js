function __method_wrapper__() {
  API.path = function (lines) {
    for (var i = 0; i < lines.length; i++) {
      var leg = lines[i];
      var coords = leg.c;
      switch (leg.op) {
        case "m":
          moveTo(coords[0], coords[1]);
          break;
        case "l":
          lineTo(coords[0], coords[1]);
          break;
        case "c":
          curveTo.apply(this, coords);
          break;
        case "h":
          close();
          break;
      }
    }
    return this;
  };

}
