  var createArc = function(radius, startAngle, endAngle, anticlockwise) {
    var EPSILON = 0.00001; // Roughly 1/1000th of a degree, see below
    var twoPi = Math.PI * 2;
    var halfPi = Math.PI / 2.0;

    while (startAngle > endAngle) {
      startAngle = startAngle - twoPi;
    }
    var totalAngle = Math.abs(endAngle - startAngle);
    if (totalAngle < twoPi) {
      if (anticlockwise) {
        totalAngle = twoPi - totalAngle;
      }
    }

    // Compute the sequence of arc curves, up to PI/2 at a time.
    var curves = [];

    // clockwise or counterclockwise
    var sgn = anticlockwise ? -1 : +1;

    var a1 = startAngle;
    for (; totalAngle > EPSILON; ) {
      var remain = sgn * Math.min(totalAngle, halfPi);
      var a2 = a1 + remain;
      curves.push(createSmallArc.call(this, radius, a1, a2));
      totalAngle -= Math.abs(a2 - a1);
      a1 = a2;
    }

    return curves;
  };
