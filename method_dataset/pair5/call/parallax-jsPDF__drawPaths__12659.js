  var drawPaths = function drawPaths(rule, isClip) {
    if (rule === "stroke" && !isClip && isStrokeTransparent.call(this)) {
      return;
    }
    if (rule !== "stroke" && !isClip && isFillTransparent.call(this)) {
      return;
    }
    var moves = [];

    //var alpha = (this.ctx.fillOpacity < 1) ? this.ctx.fillOpacity : this.ctx.globalAlpha;
    var delta;
    var xPath = this.path;
    for (var i = 0; i < xPath.length; i++) {
      var pt = xPath[i];
      switch (pt.type) {
        case "begin":
          moves.push({
            begin: true
          });
          break;
        case "close":
          moves.push({
            close: true
          });
          break;
        case "mt":
          moves.push({
            start: pt,
            deltas: [],
            abs: []
          });
          break;
        case "lt":
          var iii = moves.length;
          if (xPath[i - 1] && !isNaN(xPath[i - 1].x)) {
            delta = [pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
            if (iii > 0) {
              for (iii; iii >= 0; iii--) {
                if (moves[iii - 1].close !== true && moves[iii - 1].begin !== true) {
                  moves[iii - 1].deltas.push(delta);
                  moves[iii - 1].abs.push(pt);
                  break;
                }
              }
            }
          }
          break;
        case "bct":
          delta = [pt.x1 - xPath[i - 1].x, pt.y1 - xPath[i - 1].y, pt.x2 - xPath[i - 1].x, pt.y2 - xPath[i - 1].y, pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
          moves[moves.length - 1].deltas.push(delta);
          break;
        case "qct":
          var x1 = xPath[i - 1].x + 2.0 / 3.0 * (pt.x1 - xPath[i - 1].x);
          var y1 = xPath[i - 1].y + 2.0 / 3.0 * (pt.y1 - xPath[i - 1].y);
          var x2 = pt.x + 2.0 / 3.0 * (pt.x1 - pt.x);
          var y2 = pt.y + 2.0 / 3.0 * (pt.y1 - pt.y);
          var x3 = pt.x;
          var y3 = pt.y;
          delta = [x1 - xPath[i - 1].x, y1 - xPath[i - 1].y, x2 - xPath[i - 1].x, y2 - xPath[i - 1].y, x3 - xPath[i - 1].x, y3 - xPath[i - 1].y];
          moves[moves.length - 1].deltas.push(delta);
          break;
        case "arc":
          moves.push({
            deltas: [],
            abs: [],
            arc: true
          });
          if (Array.isArray(moves[moves.length - 1].abs)) {
            moves[moves.length - 1].abs.push(pt);
          }
          break;
      }
    }
    var style;
    if (!isClip) {
      if (rule === "stroke") {
        style = "stroke";
      } else {
        style = "fill";
      }
    } else {
      style = null;
    }
    var began = false;
    for (var k = 0; k < moves.length; k++) {
      if (moves[k].arc) {
        var arcs = moves[k].abs;
        for (var ii = 0; ii < arcs.length; ii++) {
          var arc = arcs[ii];
          if (arc.type === "arc") {
            drawArc.call(this, arc.x, arc.y, arc.radius, arc.startAngle, arc.endAngle, arc.counterclockwise, undefined, isClip, !began);
          } else {
            drawLine.call(this, arc.x, arc.y);
          }
          began = true;
        }
      } else if (moves[k].close === true) {
        this.pdf.internal.out("h");
        began = false;
      } else if (moves[k].begin !== true) {
        var x = moves[k].start.x;
        var y = moves[k].start.y;
        drawLines.call(this, moves[k].deltas, x, y);
        began = true;
      }
    }
    if (style) {
      putStyle.call(this, style);
    }
    if (isClip) {
      doClip.call(this);
    }
  };
