  var drawArc = function(
    x,
    y,
    r,
    a1,
    a2,
    counterclockwise,
    style,
    isClip,
    includeMove
  ) {
    // http://hansmuller-flex.blogspot.com/2011/10/more-about-approximating-circular-arcs.html
    var curves = createArc.call(this, r, a1, a2, counterclockwise);

    for (var i = 0; i < curves.length; i++) {
      var curve = curves[i];
      if (i === 0) {
        if (includeMove) {
          doMove.call(this, curve.x1 + x, curve.y1 + y);
        } else {
          drawLine.call(this, curve.x1 + x, curve.y1 + y);
        }
      }
      drawCurve.call(
        this,
        x,
        y,
        curve.x2,
        curve.y2,
        curve.x3,
        curve.y3,
        curve.x4,
        curve.y4
      );
    }

    if (!isClip) {
      putStyle.call(this, style);
    } else {
      doClip.call(this);
    }
  };
